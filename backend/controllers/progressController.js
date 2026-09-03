import PracticeAttempt from '../models/PracticeAttempt.js';
import Question from '../models/Question.js';
import List from '../models/List.js';
import mongoose from 'mongoose';

// Helper to get the start and end of a day
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

    // Basic validation
    if (!questionId || !listId || !status) {
      return res.status(400).json({ success: false, message: 'questionId, listId, and status are required' });
    }

    if (!['Solved', 'Wrong'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Solved or Wrong' });
    }

    // Create the attempt
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
  try {
    const userId = req.user.id;

    // 1. TOTAL QUESTIONS: Count how many questions the user has interacted with
    // (For now, let's count all questions in the database as available, 
    // or you could count questions in user's lists. We'll use total DB questions.)
    const totalQuestions = await Question.countDocuments();

    // 2. SOLVED: Unique questions the user has solved
    const solvedAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'Solved' } },
      { $group: { _id: '$question' } },
      { $count: 'count' }
    ]);
    const solved = solvedAgg.length > 0 ? solvedAgg[0].count : 0;

    // 3. ATTEMPTED: Unique questions the user has attempted (Solved or Wrong)
    const attemptedAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$question' } },
      { $count: 'count' }
    ]);
    const attempted = attemptedAgg.length > 0 ? attemptedAgg[0].count : 0;

    // 4. ACCURACY: solved attempts / total attempts * 100
    const totalAttempts = await PracticeAttempt.countDocuments({ user: userId });
    const accuracy = totalAttempts > 0 ? (solved / totalAttempts) * 100 : 0;

    // 5. TODAY'S PROGRESS
    const todayStart = getDayRange(new Date());
    const todayAttempts = await PracticeAttempt.find({
      user: userId,
      attemptedAt: { $gte: todayStart.start, $lte: todayStart.end }
    });

    const todaySolved = todayAttempts.filter(a => a.status === 'Solved').length;
    const todayWrong = todayAttempts.filter(a => a.status === 'Wrong').length;
    const todayTotal = todayAttempts.length;
    // Pending is just an estimate - we don't know how many they planned to do, 
    // but we can say "Pending" = totalQuestionListSize - completedToday if available.
    // For now, we'll treat pending as 0 (or just total - attempted today).
    const pending = 0; // Or calculate based on list size if you have that context.

    // 6. ACCURACY LAST 7 DAYS (Array of objects)
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
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        accuracy: Math.round(dayAccuracy * 10) / 10
      });
    }

    // 7. WEAK TOPICS: Group by question.topic, calculate accuracy
    const weakTopicsAgg = await PracticeAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'questions',
          localField: 'question',
          foreignField: '_id',
          as: 'questionData'
        }
      },
      { $unwind: '$questionData' },
      {
        $group: {
          _id: '$questionData.topic',
          totalAttempts: { $sum: 1 },
          solvedAttempts: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } }
        }
      },
      {
        $project: {
          name: '$_id',
          accuracy: {
            $cond: [
              { $eq: ['$totalAttempts', 0] },
              0,
              { $multiply: [{ $divide: ['$solvedAttempts', '$totalAttempts'] }, 100] }
            ]
          }
        }
      },
      { $sort: { accuracy: 1 } }, // Weakest topics first
      { $limit: 5 }
    ]);

    const weakTopics = weakTopicsAgg.map(t => ({
      name: t.name,
      accuracy: Math.round(t.accuracy * 10) / 10
    }));

    res.status(200).json({
      success: true,
      overview: {
        totalQuestions,
        solved,
        attempted,
        accuracy: Math.round(accuracy * 10) / 10
      },
      today: {
        total: todayTotal,
        solved: todaySolved,
        wrong: todayWrong,
        pending
      },
      accuracyLast7Days: accuracy7Days,
      weakTopics
    });
  } catch (error) {
    console.error('Error fetching progress:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching progress' });
  }
};