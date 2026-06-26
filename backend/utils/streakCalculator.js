const calculateStreak = async (Progress, userId, habitId) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const record = await Progress.findOne({
      userId,
      habitId,
      date: {
        $gte: new Date(dateStr + 'T00:00:00.000Z'),
        $lte: new Date(dateStr + 'T23:59:59.999Z'),
      },
      completed: true,
    });

    if (record) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = async (Progress, userId, habitId) => {
  const records = await Progress.find({ userId, habitId, completed: true })
    .sort({ date: 1 })
    .lean();

  if (records.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < records.length; i++) {
    const prevDate = new Date(records[i - 1].date);
    const currDate = new Date(records[i].date);
    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};

const checkMissedDays = async (Progress, userId, habitId) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedDates = await Progress.find({
    userId,
    habitId,
    date: { $gte: thirtyDaysAgo, $lte: today },
    completed: true,
  }).lean();

  const completedSet = new Set(
    completedDates.map(r => new Date(r.date).toISOString().split('T')[0])
  );

  const missedDays = [];
  let currentDate = new Date(thirtyDaysAgo);

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!completedSet.has(dateStr)) {
      missedDays.push(dateStr);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return missedDays;
};

module.exports = { calculateStreak, calculateLongestStreak, checkMissedDays };
