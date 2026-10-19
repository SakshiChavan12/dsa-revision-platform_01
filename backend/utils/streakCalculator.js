// backend/utils/streakCalculator.js
export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export const calculateStreak = (dateStrings) => {
  if (!dateStrings || dateStrings.length === 0) return 0;

  // Sort descending (newest first)
  const sorted = [...dateStrings].sort((a, b) => b.localeCompare(a));
  
  const todayStr = getDateString(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getDateString(yesterdayDate);

  const mostRecent = sorted[0];

  // If the last completion wasn't today or yesterday, the streak is broken (0)
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(mostRecent);

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i]);
    
    // Calculate difference in days
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      break; // Streak broken
    }
  }

  return streak;
};