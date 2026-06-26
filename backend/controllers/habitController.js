const Habit = require('../models/Habit');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { sendAchievementEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const createHabit = async (req, res, next) => {
  try {
    console.log('Incoming Habit Data:', req.body);
    console.log('User ID:', req.user._id);

    const habitData = {
      userId: req.user._id,
      ...req.body,
    };

    console.log('Final Habit Data:', habitData);

    const habit = await Habit.create(habitData);

    await checkAndAwardAchievements(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

const getHabits = async (req, res, next) => {
  try {
    const { category, isActive, sort, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id };
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { habitName: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const habits = await Habit.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Habit.countDocuments(query);

    res.json({
      success: true,
      data: habits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found.',
      });
    }

    res.json({
      success: true,
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found.',
      });
    }

    res.json({
      success: true,
      message: 'Habit updated successfully',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found.',
      });
    }

    await Progress.deleteMany({ habitId: req.params.id });

    res.json({
      success: true,
      message: 'Habit and associated progress deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const checkAndAwardAchievements = async (userId) => {
  try {
    const habitCount = await Habit.countDocuments({ userId, isActive: true });
    const totalCompletions = await Progress.countDocuments({ userId, completed: true });
    const achievements = [];

    const achievementDefinitions = [
      { title: 'First Habit', description: 'Created your first habit', condition: habitCount >= 1 },
      { title: 'Habit Builder', description: 'Created 5 habits', condition: habitCount >= 5 },
      { title: 'Habit Master', description: 'Created 10 habits', condition: habitCount >= 10 },
      { title: 'First Completion', description: 'Completed your first habit', condition: totalCompletions >= 1 },
      { title: '25 Completions', description: 'Completed 25 habits in total', condition: totalCompletions >= 25 },
      { title: '100 Completions', description: 'Completed 100 habits in total', condition: totalCompletions >= 100 },
    ];

    for (const def of achievementDefinitions) {
      if (def.condition) {
        const existing = await Achievement.findOne({ userId, title: def.title });
        if (!existing) {
          const achievement = await Achievement.create({
            userId,
            title: def.title,
            description: def.description,
            type: 'milestone',
          });
          achievements.push(achievement);

          const user = await User.findById(userId);
          if (user) {
            sendAchievementEmail(user, achievement);
          }
        }
      }
    }

    return achievements;
  } catch (error) {
    logger.error('Achievement check error:', error.message);
    return [];
  }
};

module.exports = { createHabit, getHabits, getHabit, updateHabit, deleteHabit };
