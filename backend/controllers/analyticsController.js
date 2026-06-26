const { getDashboardAnalytics, getHabitAnalytics } = require('../services/analyticsService');
const logger = require('../utils/logger');

const getDashboard = async (req, res, next) => {
  try {
    const analytics = await getDashboardAnalytics(req.user._id);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

const getHabitAnalyticsHandler = async (req, res, next) => {
  try {
    const analytics = await getHabitAnalytics(req.user._id, req.params.habitId);

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found.',
      });
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getHabitAnalytics: getHabitAnalyticsHandler };
