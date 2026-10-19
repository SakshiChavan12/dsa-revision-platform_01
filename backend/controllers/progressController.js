// backend/controllers/progressController.js
import PracticeAttempt from '../models/PracticeAttempt.js';
import Question from '../models/Question.js';
import List from '../models/List.js';
import Submission from '../models/Submission.js';
import DailyStreak from '../models/DailyStreak.js';
import { getDateString, calculateStreak } from '../utils/streakCalculator.js';
import mongoose from 'mongoose';

const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Record a practice attempt
// @route   POST /api/practice/attempt
export const recordPracticeAttempt = async (req, res) => {
  try {
    const { questionId, listId, status } = req.body;

    if (!questionId || !listId || !status) {
      return res.status(400).json({ success: false, message: 'questionId, listId, and status are required' });
    }

    if (!['Solved', 'Wrong'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Solved or Wrong' });
    }

    const attempt = await PracticeAttempt.create({
      user: req.user.id,
      question: questionId,
      list: listId,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Practice attempt recorded successfully',
      attempt
    });
  } catch (error) {
    console.error('Error recording attempt:', error.message);
    res.status(500).json({ success: false, message: 'Server error recording attempt' });
  }
};

// @desc    Get user's progress
// @route   GET /api/progress
export const getProgress = async (req, res) => {
  // ... (Keep your existing getProgress exactly as it is) ...
  try {
    const userId = req.user.id;
    const totalQuestions = await Question.countDocuments();
    const solvedAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'Solved' } },
      { $group: { _id: '$question' } },
      { $count: 'count' }
    ]);
    const solved = solvedAgg.length > 0 ? solvedAgg[0].count : 0;
    const attemptedAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$question' } },
      { $count: 'count' }
    ]);
    const attempted = attemptedAgg.length > 0 ? attemptedAgg[0].count : 0;
    const totalAttempts = await PracticeAttempt.countDocuments({ user: userId });
    const accuracy = totalAttempts > 0 ? (solved / totalAttempts) * 100 : 0;

    const todayStart = getDayRange(new Date());
    const todayAttempts = await PracticeAttempt.find({
      user: userId,
      attemptedAt: { $gte: todayStart.start, $lte: todayStart.end }
    });

    const todaySolved = todayAttempts.filter(a => a.status === 'Solved').length;
    const todayWrong = todayAttempts.filter(a => a.status === 'Wrong').length;
    const todayTotal = todayAttempts.length;
    const pending = 0;

    const accuracy7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayRange = getDayRange(date);
      const dayAttempts = await PracticeAttempt.find({
        user: userId,
        attemptedAt: { $gte: dayRange.start, $lte: dayRange.end }
      });
      const daySolved = dayAttempts.filter(a => a.status === 'Solved').length;
      const dayAccuracy = dayAttempts.length > 0 ? (daySolved / dayAttempts.length) * 100 : 0;
      accuracy7Days.push({
        date: date.toISOString().split('T')[0],
        accuracy: Math.round(dayAccuracy * 10) / 10
      });
    }

    const weakTopicsAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'questions', localField: 'question', foreignField: '_id', as: 'questionData' } },
      { $unwind: '$questionData' },
      { $group: { _id: '$questionData.topic', totalAttempts: { $sum: 1 }, solvedAttempts: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } } } },
      { $project: { name: '$_id', accuracy: { $cond: [{ $eq: ['$totalAttempts', 0] }, 0, { $multiply: [{ $divide: ['$solvedAttempts', '$totalAttempts'] }, 100] }] } } },
      { $sort: { accuracy: 1 } },
      { $limit: 5 }
    ]);

    const weakTopics = weakTopicsAgg.map(t => ({ name: t.name, accuracy: Math.round(t.accuracy * 10) / 10 }));

    res.status(200).json({
      success: true,
      overview: { totalQuestions, solved, attempted, accuracy: Math.round(accuracy * 10) / 10 },
      today: { total: todayTotal, solved: todaySolved, wrong: todayWrong, pending },
      accuracyLast7Days: accuracy7Days,
      weakTopics
    });
  } catch (error) {
    console.error('Error fetching progress:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching progress' });
  }
};

// @desc    Get dynamic data for the Dashboard
// @route   GET /api/progress/dashboard
export const getDashboardData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total Questions
    const totalQuestions = await Question.countDocuments();

    // 2. Solved Questions
    const solvedAgg = await PracticeAttempt.aggregate([
      { $match: { user: userId, status: 'Solved' } },
      { $group: { _id: '$question' } }
    ]);
    const solvedQuestionIds = solvedAgg.map(s => s._id.toString());
    const totalSolved = solvedQuestionIds.length;

    // 3. Overall Accuracy
    const totalAttempts = await PracticeAttempt.countDocuments({ user: userId });
    const totalSolvedAttempts = await PracticeAttempt.countDocuments({ user: userId, status: 'Solved' });
    const accuracy = totalAttempts === 0 ? 0 : Math.round((totalSolvedAttempts / totalAttempts) * 100);

    // 4. Today's Goal
    const { start, end } = getDayRange(new Date());
    const todaySolvedAgg = await PracticeAttempt.aggregate([
      { $match: { user: userId, status: 'Solved', attemptedAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$question' } }
    ]);
    const todayCount = todaySolvedAgg.length;

    // --- NEW STREAK LOGIC ---
    // If they hit the goal today, save a DailyStreak record.
    const goalTarget = 3;
    if (todayCount >= goalTarget) {
      const todayStr = getDateString(new Date());
      try {
        await DailyStreak.create({ user: userId, date: todayStr });
      } catch (err) {
        // Ignore duplicate key error (meaning they already completed it today)
        if (err.code !== 11000) console.error("Streak save error:", err);
      }
    }
    // ------------------------

    // 5. Recent Activity
    const recentActivityRaw = await Submission.find({ user: userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('question', 'title difficulty');
    
    const recentActivity = recentActivityRaw
      .filter(sub => sub.question)
      .map(sub => ({
        title: sub.question.title,
        difficulty: sub.question.difficulty,
        status: sub.isCorrect ? 'Solved' : 'Wrong',
        time: sub.submittedAt
      }));

    // 6. Continue Practice
    const continuePracticeAgg = await PracticeAttempt.aggregate([
      { $match: { user: userId } },
      { $sort: { attemptedAt: -1 } },
      { $group: { _id: '$question', lastAttempted: { $first: '$attemptedAt' }, listId: { $first: '$list' }, lastStatus: { $first: '$status' } } },
      { $sort: { lastStatus: 1, lastAttempted: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'questions', localField: '_id', foreignField: '_id', as: 'questionData' } },
      { $unwind: '$questionData' }
    ]);

    const continuePractice = continuePracticeAgg.map(item => ({
      id: item._id,
      title: item.questionData.title,
      difficulty: item.questionData.difficulty,
      topic: item.questionData.topic || item.questionData.tags?.[0] || 'General',
      listId: item.listId,
      lastPracticed: item.lastAttempted,
      isSolved: item.lastStatus === 'Solved'
    }));

    // 7. Weak Topics
    const weakTopicsAgg = await Submission.aggregate([
      { $match: { user: userId } },
      { $lookup: { from: 'questions', localField: 'question', foreignField: '_id', as: 'qData' } },
      { $unwind: '$qData' },
      { $group: { _id: '$qData.topic', total: { $sum: 1 }, correct: { $sum: { $cond: ['$isCorrect', 1, 0] } } } },
      { $project: { name: '$_id', total: 1, pct: { $cond: [{ $eq: ['$total', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$correct', '$total'] }, 100] }, 0] }] } } },
      { $match: { total: { $gte: 2 } } },
      { $match: { pct: { $lt: 75 } } },
      { $sort: { pct: 1 } },
      { $limit: 3 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalSolved,
        accuracy,
        todayCount,
        recentActivity,
        continuePractice,
        weakTopics: weakTopicsAgg,
        solvedQuestionIds
      }
    });

  } catch (error) {
    console.error('Dashboard Data Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard data' });
  }
};

// @desc    Get user's current streak
// @route   GET /api/progress/streak
export const getStreak = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Fetch all completion dates for this user
    const records = await DailyStreak.find({ user: userId }).select('date');
    const dates = records.map(r => r.date);
    
    const streak = calculateStreak(dates);

    res.status(200).json({ success: true, streak });
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};