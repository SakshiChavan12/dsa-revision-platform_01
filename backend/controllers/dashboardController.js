// backend/controllers/dashboardController.js
import mongoose from 'mongoose';
import Submission from '../models/Submission.js';
import PracticeAttempt from '../models/PracticeAttempt.js';
import Question from '../models/Question.js';

// ─────────────────────────────────────────────
// Date helpers (server-side, consistent timezone)
// ─────────────────────────────────────────────
function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// YYYY-MM-DD key in LOCAL time
function dayKey(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Human-readable relative time
function relativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;

  // Compare by calendar day, not by 24h window
  const today = dayKey(now);
  const thatDay = dayKey(then);
  if (today === thatDay) return 'Today';

  const yesterday = dayKey(daysAgo(1));
  if (thatDay === yesterday) return 'Yesterday';

  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return then.toLocaleDateString();
}

// ─────────────────────────────────────────────
// STAT: Today's Goal
// ─────────────────────────────────────────────
async function getTodayGoal(userId) {
  const DAILY_TARGET = 3;

  // Distinct questions the user solved today
  const todaysSolved = await Submission.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isCorrect: true,
        submittedAt: { $gte: startOfDay(), $lte: endOfDay() }
      }
    },
    { $group: { _id: '$question' } },
    { $count: 'count' }
  ]);

  const completed = todaysSolved.length > 0 ? todaysSolved[0].count : 0;

  return {
    target: DAILY_TARGET,
    completed,
    remaining: Math.max(DAILY_TARGET - completed, 0),
    isCompleted: completed >= DAILY_TARGET
  };
}

// ─────────────────────────────────────────────
// STAT: Total / Solved / Accuracy / Weekly
// ─────────────────────────────────────────────
async function getStats(userId) {
  const totalQuestions = await Question.countDocuments();

  // Distinct solved questions (all time)
  const solvedAgg = await Submission.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isCorrect: true
      }
    },
    { $group: { _id: '$question' } },
    { $count: 'count' }
  ]);
  const solved = solvedAgg.length > 0 ? solvedAgg[0].count : 0;

  // Total evaluated attempts (every submission counts as 1 attempt)
  const totalAttempts = await Submission.countDocuments({
    user: userId
  });
  const acceptedAttempts = await Submission.countDocuments({
    user: userId,
    isCorrect: true
  });

  const accuracy =
    totalAttempts > 0 ? (acceptedAttempts / totalAttempts) * 100 : 0;

  const solvedPercentage =
    totalQuestions > 0 ? (solved / totalQuestions) * 100 : 0;

  // Weekly delta
  const weekStart = startOfDay(daysAgo(6));
  const prevWeekStart = startOfDay(daysAgo(13));
  const prevWeekEnd = endOfDay(daysAgo(7));

  const solvedThisWeekAgg = await Submission.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isCorrect: true,
        submittedAt: { $gte: weekStart }
      }
    },
    { $group: { _id: '$question' } },
    { $count: 'count' }
  ]);

  const solvedLastWeekAgg = await Submission.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isCorrect: true,
        submittedAt: { $gte: prevWeekStart, $lte: prevWeekEnd }
      }
    },
    { $group: { _id: '$question' } },
    { $count: 'count' }
  ]);

  const solvedThisWeek =
    solvedThisWeekAgg.length > 0 ? solvedThisWeekAgg[0].count : 0;
  const solvedLastWeek =
    solvedLastWeekAgg.length > 0 ? solvedLastWeekAgg[0].count : 0;

  const hasWeeklyData = solvedLastWeek > 0 || solvedThisWeek > 0;

  return {
    totalQuestions,
    solved,
    solvedPercentage: Math.round(solvedPercentage * 10) / 10,
    accuracy: Math.round(accuracy * 10) / 10,
    weeklyChange: {
      solvedThisWeek,
      solvedLastWeek,
      solvedDelta: solvedThisWeek - solvedLastWeek,
      hasData: hasWeeklyData
    }
  };
}

// ─────────────────────────────────────────────
// STAT: Current Streak
// ─────────────────────────────────────────────
async function getStreak(userId) {
  // Get distinct calendar days when user solved at least one question
  const raw = await Submission.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isCorrect: true
      }
    },
    {
      $group: {
        _id: {
          yyyy: { $year: '$submittedAt' },
          mm: { $month: '$submittedAt' },
          dd: { $dayOfMonth: '$submittedAt' }
        }
      }
    }
  ]);

  if (raw.length === 0) return { current: 0 };

  // Build set of day keys
  const solvedDays = new Set(
    raw.map((r) => {
      const mm = String(r._id.mm).padStart(2, '0');
      const dd = String(r._id.dd).padStart(2, '0');
      return `${r._id.yyyy}-${mm}-${dd}`;
    })
  );

  // Count backwards from today (allow today OR yesterday as anchor)
  let streak = 0;
  let cursor = new Date();

  // If not solved today, allow the streak to start from yesterday
  if (!solvedDays.has(dayKey(cursor))) {
    cursor = daysAgo(1);
    if (!solvedDays.has(dayKey(cursor))) {
      return { current: 0 };
    }
  }

  while (solvedDays.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current: streak };
}

// ─────────────────────────────────────────────
// STAT: Continue Practice
// ─────────────────────────────────────────────
async function getContinuePractice(userId) {
  // Latest 10 attempts, distinct by question, newest first
  const latest = await PracticeAttempt.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $sort: { attemptedAt: -1 } },
    {
      $group: {
        _id: '$question',
        lastAttempted: { $first: '$attemptedAt' },
        lastStatus: { $first: '$status' }
      }
    },
    { $sort: { lastAttempted: -1 } },
    { $limit: 3 }
  ]);

  if (latest.length === 0) return [];

  const questionIds = latest.map((l) => l._id);
  const questions = await Question.find({ _id: { $in: questionIds } });

  const qMap = {};
  questions.forEach((q) => {
    qMap[q._id.toString()] = q;
  });

  return latest
    .map((l) => {
      const q = qMap[l._id.toString()];
      if (!q) return null;
      return {
        _id: q._id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        tags: q.tags || [],
        lastStatus: l.lastStatus,
        lastPracticedAt: l.lastAttempted,
        lastPracticedLabel: relativeTime(l.lastAttempted)
      };
    })
    .filter(Boolean);
}

// ─────────────────────────────────────────────
// STAT: Weak Topics
// ─────────────────────────────────────────────
async function getWeakTopics(userId) {
  const MIN_ATTEMPTS = 3;

  const agg = await Submission.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'questions',
        localField: 'question',
        foreignField: '_id',
        as: 'q'
      }
    },
    { $unwind: '$q' },
    {
      $group: {
        _id: '$q.topic',
        totalAttempts: { $sum: 1 },
        acceptedAttempts: {
          $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] }
        }
      }
    },
    {
      $match: { totalAttempts: { $gte: MIN_ATTEMPTS } }
    },
    {
      $project: {
        name: '$_id',
        accuracy: {
          $multiply: [
            { $divide: ['$acceptedAttempts', '$totalAttempts'] },
            100
          ]
        }
      }
    },
    { $sort: { accuracy: 1 } },
    { $limit: 3 }
  ]);

  return agg.map((t) => ({
    name: t.name,
    accuracy: Math.round(t.accuracy * 10) / 10
  }));
}

// ─────────────────────────────────────────────
// STAT: Recent Activity
// ─────────────────────────────────────────────
async function getRecentActivity(userId) {
  const recent = await Submission.find({ user: userId })
    .sort({ submittedAt: -1 })
    .limit(5)
    .populate('question', 'title difficulty');

  return recent.map((s) => ({
    _id: s._id,
    questionId: s.question?._id,
    title: s.question?.title || 'Unknown question',
    difficulty: s.question?.difficulty || 'Easy',
    status: s.status,
    statusLabel: s.isCorrect ? 'Solved' : 'Wrong',
    submittedAt: s.submittedAt,
    relativeTime: relativeTime(s.submittedAt)
  }));
}

// ─────────────────────────────────────────────
// MAIN CONTROLLER
// ─────────────────────────────────────────────
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [todayGoal, stats, streak, continuePractice, weakTopics, recentActivity] =
      await Promise.all([
        getTodayGoal(userId),
        getStats(userId),
        getStreak(userId),
        getContinuePractice(userId),
        getWeakTopics(userId),
        getRecentActivity(userId)
      ]);

    return res.status(200).json({
      success: true,
      user: {
        name: req.user.name,
        email: req.user.email
      },
      todayGoal,
      stats,
      streak,
      continuePractice,
      weakTopics,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data.'
    });
  }
};