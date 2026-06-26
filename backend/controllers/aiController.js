const { generateMotivation, generateSuggestions } = require('../services/aiService');
const Progress = require('../models/Progress');
const Habit = require('../models/Habit');
const { calculateStreak } = require('../utils/streakCalculator');
const { calculateCompletionRate } = require('../utils/productivityScore');
const logger = require('../utils/logger');

const getMotivation = async (req, res, next) => {
  try {
    const { mood = 'motivated' } = req.body;
    const validMoods = ['happy', 'sad', 'lazy', 'stressed', 'motivated'];
    const safeMood = validMoods.includes(mood) ? mood : 'motivated';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ userId: req.user._id, isActive: true }).lean();
    const totalHabits = habits.length;

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const completedToday = await Progress.countDocuments({
      userId: req.user._id,
      date: { $gte: today, $lte: todayEnd },
      completed: true,
    });

    const completionRate = calculateCompletionRate(completedToday, totalHabits);

    let maxStreak = 0;
    for (const habit of habits) {
      const streak = await calculateStreak(Progress, req.user._id, habit._id);
      maxStreak = Math.max(maxStreak, streak);
    }

    const message = await generateMotivation(safeMood, maxStreak, completionRate);

    res.json({
      success: true,
      data: {
        mood: safeMood,
        currentStreak: maxStreak,
        completionRate,
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ userId: req.user._id, isActive: true }).lean();

    const habitAnalytics = await Promise.all(
      habits.map(async (habit) => {
        const totalDays = 30;
        const completedDays = await Progress.countDocuments({
          userId: req.user._id,
          habitId: habit._id,
          date: { $gte: thirtyDaysAgo },
          completed: true,
        });

        return {
          habitName: habit.habitName,
          category: habit.category,
          targetFrequency: habit.targetFrequency,
          reminderTime: habit.reminderTime,
          completionRate: calculateCompletionRate(completedDays, totalDays),
          totalCompletions: completedDays,
        };
      })
    );

    const suggestions = await generateSuggestions({
      totalHabits: habits.length,
      habits: habitAnalytics,
    });

    res.json({
      success: true,
      data: {
        suggestions,
        habitAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMotivation, getSuggestions };
