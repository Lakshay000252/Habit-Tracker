const calculateProductivityScore = (completedToday, totalHabits, currentStreak) => {
  if (totalHabits === 0) return 0;

  const completionRate = (completedToday / totalHabits) * 100;
  const streakBonus = Math.min(currentStreak * 2, 20);
  const score = Math.min(Math.round(completionRate * 0.8 + streakBonus), 100);

  return score;
};

const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

module.exports = { calculateProductivityScore, calculateCompletionRate };
