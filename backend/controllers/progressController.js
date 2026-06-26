const Progress = require('../models/Progress');
const Habit = require('../models/Habit');
const Achievement = require('../models/Achievement');
const { calculateStreak, calculateLongestStreak } = require('../utils/streakCalculator');
const { sendAchievementEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const markCompleted = async (req, res, next) => {
  try {
    const { habitId, date, note } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found.',
      });
    }

    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    let progress = await Progress.findOne({
      userId: req.user._id,
      habitId,
      date: { $gte: targetDate, $lte: dayEnd },
    });

    if (progress) {
      if (progress.completed) {
        return res.json({
          success: true,
          message: 'Habit already marked as completed for this date.',
          data: progress,
        });
      }
      progress.completed = true;
      if (note) progress.note = note;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user._id,
        habitId,
        date: targetDate,
        completed: true,
        note,
      });
    }

    const streak = await calculateStreak(Progress, req.user._id, habitId);
    const longestStreak = await calculateLongestStreak(Progress, req.user._id, habitId);

    await checkStreakAchievements(req.user._id, streak);

    const totalCompletions = await Progress.countDocuments({
      userId: req.user._id,
      completed: true,
    });
    await checkCompletionAchievements(req.user._id, totalCompletions);

    res.json({
      success: true,
      message: 'Habit marked as completed!',
      data: {
        progress,
        currentStreak: streak,
        longestStreak,
      },
    });
  } catch (error) {
    next(error);
  }
};

const markIncomplete = async (req, res, next) => {
  try {
    const { habitId, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const progress = await Progress.findOneAndDelete({
      userId: req.user._id,
      habitId,
      date: { $gte: targetDate, $lte: dayEnd },
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No completion record found for this habit on this date.',
      });
    }

    res.json({
      success: true,
      message: 'Habit marked as incomplete.',
    });
  } catch (error) {
    next(error);
  }
};

const getProgressHistory = async (req, res, next) => {
  try {
    const { habitId, startDate, endDate, page = 1, limit = 30 } = req.query;

    const query = { userId: req.user._id };
    if (habitId) query.habitId = habitId;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await Progress.find(query)
      .populate('habitId', 'habitName category color')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Progress.countDocuments(query);

    res.json({
      success: true,
      data: records,
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

const getDailyProgress = async (req, res, next) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const targetDate = new Date(dateStr + 'T00:00:00.000Z');
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const habits = await Habit.find({ userId: req.user._id, isActive: true }).lean();
    const progressRecords = await Progress.find({
      userId: req.user._id,
      date: { $gte: targetDate, $lte: dayEnd },
    }).lean();

    const completedIds = new Set(progressRecords.filter(p => p.completed).map(p => p.habitId.toString()));

    const dailyProgress = habits.map(habit => ({
      habitId: habit._id,
      habitName: habit.habitName,
      category: habit.category,
      color: habit.color,
      reminderTime: habit.reminderTime,
      completed: completedIds.has(habit._id.toString()),
    }));

    const completed = dailyProgress.filter(h => h.completed).length;
    const total = habits.length;

    res.json({
      success: true,
      data: {
        date: dateStr,
        total,
        completed,
        pending: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        habits: dailyProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const checkStreakAchievements = async (userId, streak) => {
  const streakMilestones = [
    { days: 3, title: '3-Day Streak', description: 'Maintained a 3-day habit streak' },
    { days: 7, title: '7-Day Streak', description: 'Maintained a 7-day habit streak' },
    { days: 14, title: '2 Weeks Strong', description: 'Maintained a 14-day habit streak' },
    { days: 30, title: '30-Day Streak', description: 'Maintained a 30-day habit streak' },
    { days: 60, title: '60-Day Streak', description: 'Maintained a 60-day habit streak' },
    { days: 100, title: 'Century Streak', description: 'Maintained a 100-day habit streak' },
  ];

  for (const milestone of streakMilestones) {
    if (streak >= milestone.days) {
      const existing = await Achievement.findOne({ userId, title: milestone.title });
      if (!existing) {
        const achievement = await Achievement.create({
          userId,
          title: milestone.title,
          description: milestone.description,
          type: 'streak',
        });

        const User = require('../models/User');
        const user = await User.findById(userId);
        if (user) {
          sendAchievementEmail(user, achievement);
        }
      }
    }
  }
};

const checkCompletionAchievements = async (userId, totalCompletions) => {
  const completionMilestones = [
    { count: 1, title: 'First Completion', description: 'Completed your first habit' },
    { count: 10, title: 'Dedicated', description: 'Completed 10 habits in total' },
    { count: 25, title: 'Consistency Master', description: 'Completed 25 habits in total' },
    { count: 50, title: 'Half Century', description: 'Completed 50 habits in total' },
    { count: 100, title: 'Century Club', description: 'Completed 100 habits in total' },
    { count: 365, title: 'Year of Habits', description: 'Completed 365 habits in total' },
  ];

  for (const milestone of completionMilestones) {
    if (totalCompletions >= milestone.count) {
      const existing = await Achievement.findOne({ userId, title: milestone.title });
      if (!existing) {
        const achievement = await Achievement.create({
          userId,
          title: milestone.title,
          description: milestone.description,
          type: 'consistency',
        });

        const User = require('../models/User');
        const user = await User.findById(userId);
        if (user) {
          sendAchievementEmail(user, achievement);
        }
      }
    }
  }
};

module.exports = { markCompleted, markIncomplete, getProgressHistory, getDailyProgress };
