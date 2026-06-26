const Progress = require('../models/Progress');
const Habit = require('../models/Habit');
const { calculateStreak, calculateLongestStreak } = require('../utils/streakCalculator');
const { calculateProductivityScore, calculateCompletionRate } = require('../utils/productivityScore');

const getDashboardAnalytics = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const totalHabits = await Habit.countDocuments({ userId, isActive: true });

  const completedToday = await Progress.countDocuments({
    userId,
    date: { $gte: today, $lte: todayEnd },
    completed: true,
  });

  const pendingToday = Math.max(0, totalHabits - completedToday);

  const weeklyProgress = await Progress.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: startOfWeek, $lte: todayEnd },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$date' },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlyProgress = await Progress.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: startOfMonth, $lte: todayEnd },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$date' },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const completionRate = calculateCompletionRate(completedToday, totalHabits);

  const habits = await Habit.find({ userId, isActive: true }).lean();
  let totalStreak = 0;
  for (const habit of habits) {
    const streak = await calculateStreak(Progress, userId, habit._id);
    totalStreak = Math.max(totalStreak, streak);
  }

  const productivityScore = calculateProductivityScore(completedToday, totalHabits, totalStreak);

  return {
    totalHabits,
    completedToday,
    pendingToday,
    completionRate,
    productivityScore,
    currentStreak: totalStreak,
    weeklyProgress,
    monthlyProgress,
  };
};

const getHabitAnalytics = async (userId, habitId) => {
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) return null;

  const currentStreak = await calculateStreak(Progress, userId, habitId);
  const longestStreak = await calculateLongestStreak(Progress, userId, habitId);

  const totalCompletions = await Progress.countDocuments({
    userId,
    habitId,
    completed: true,
  });

  return {
    habit,
    currentStreak,
    longestStreak,
    totalCompletions,
  };
};

module.exports = { getDashboardAnalytics, getHabitAnalytics };
