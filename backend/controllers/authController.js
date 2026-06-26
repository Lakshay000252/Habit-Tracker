const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const { getConnectionStatus } = require('../config/db');
const logger = require('../utils/logger');

const checkDB = () => {
  if (!getConnectionStatus()) {
    const err = new Error('Database not connected. Cannot process authentication requests. Please set a valid MONGO_URI in .env and restart the server.');
    err.status = 503;
    throw err;
  }
};

const register = async (req, res, next) => {
  try {
    checkDB();
    const { name, email, password } = req.body;
    console.log('Registration Request:', { name, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    const user = await User.create({ name, email, password });
    console.log('Registration Success - User ID:', user._id);

    const token = generateToken(user._id);
    console.log('JWT Generated for registration');

    const refreshToken = generateRefreshToken(user._id);

    sendWelcomeEmail(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.log('Registration Error:', error.message);
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    checkDB();
    const { email, password } = req.body;
    console.log('Login Request:', { email });

    const user = await User.findOne({ email }).select('+password');
    console.log('User Found:', !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.',
      });
    }

    const token = generateToken(user._id);
    console.log('JWT Generated for login');

    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.log('Login Error:', error.message);
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    next(error);
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token.',
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user, resetUrl);

    res.json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
      data: { token: authToken },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshTokenHandler, forgotPassword, resetPassword };
