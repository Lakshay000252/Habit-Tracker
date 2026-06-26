const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"Lakshay-Arpit Habit AI App" <${process.env.EMAIL_FROM || 'noreply@habitai.com'}>`,
      to: user.email,
      subject: 'Welcome to Lakshay-Arpit Habit AI App - Start Building Better Habits!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to Lakshay-Arpit Habit AI App! 🎉</h1>
          <p>Hi ${user.name},</p>
          <p>We're excited to help you build better habits with the power of AI motivation!</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Quick Start Guide:</h3>
            <ol>
              <li>Create your first habit</li>
              <li>Set a daily reminder</li>
              <li>Track your progress daily</li>
              <li>Get AI-powered motivation</li>
            </ol>
          </div>
          <p>Start your journey today!</p>
          <p>Stay consistent,<br>The Lakshay-Arpit Habit AI App Team</p>
        </div>
      `,
    });
    logger.info(`Welcome email sent to ${user.email}`);
  } catch (error) {
    logger.error(`Welcome email error: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"Lakshay-Arpit Habit AI App" <${process.env.EMAIL_FROM || 'noreply@habitai.com'}>`,
      to: user.email,
      subject: 'Password Reset - Lakshay-Arpit Habit AI App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Password Reset Request</h1>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #6366f1; color: white; padding: 12px 30px; 
                      border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Stay consistent,<br>The Lakshay-Arpit Habit AI App Team</p>
        </div>
      `,
    });
    logger.info(`Password reset email sent to ${user.email}`);
  } catch (error) {
    logger.error(`Password reset email error: ${error.message}`);
  }
};

const sendAchievementEmail = async (user, achievement) => {
  try {
    await transporter.sendMail({
      from: `"Lakshay-Arpit Habit AI App" <${process.env.EMAIL_FROM || 'noreply@habitai.com'}>`,
      to: user.email,
      subject: `🏆 Achievement Unlocked: ${achievement.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">Congratulations ${user.name}! 🏆</h1>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 64px;">🎉</div>
            <h2 style="color: #6366f1;">${achievement.title}</h2>
            <p style="font-size: 18px; color: #6b7280;">${achievement.description}</p>
          </div>
          <p>Keep up the amazing work! Your consistency is paying off.</p>
          <p>Stay consistent,<br>The Lakshay-Arpit Habit AI App Team</p>
        </div>
      `,
    });
    logger.info(`Achievement email sent to ${user.email} for ${achievement.title}`);
  } catch (error) {
    logger.error(`Achievement email error: ${error.message}`);
  }
};

const sendDailyReminder = async (user, pendingHabits) => {
  if (pendingHabits.length === 0) return;

  try {
    const habitList = pendingHabits.map(h => `<li>${h.habitName} (${h.category})</li>`).join('');

    await transporter.sendMail({
      from: `"Lakshay-Arpit Habit AI App" <${process.env.EMAIL_FROM || 'noreply@habitai.com'}>`,
      to: user.email,
      subject: `📋 You have ${pendingHabits.length} pending habits today!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Daily Reminder 📋</h1>
          <p>Hi ${user.name},</p>
          <p>You still have ${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} to complete today:</p>
          <ul>${habitList}</ul>
          <p>Remember: Consistency beats perfection!</p>
          <p>Stay consistent,<br>The Lakshay-Arpit Habit AI App Team</p>
        </div>
      `,
    });
    logger.info(`Daily reminder sent to ${user.email}`);
  } catch (error) {
    logger.error(`Daily reminder error: ${error.message}`);
  }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail, sendAchievementEmail, sendDailyReminder };
