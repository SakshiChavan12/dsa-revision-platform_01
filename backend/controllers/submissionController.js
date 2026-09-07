// backend/controllers/submissionController.js
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';

export const runCode = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const question = await Question.findById(questionId);
    
    // If no questionId is sent, it will crash here
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // MOCK RESPONSE: Always show 2/2 passed for now
    res.status(200).json({
      success: true,
      status: 'Accepted',
      passed: 2,
      total: 2,
      results: [
        { testCase: 1, passed: true, expectedOutput: "Test", actualOutput: "Test" },
        { testCase: 2, passed: true, expectedOutput: "Test", actualOutput: "Test" }
      ]
    });
  } catch (error) {
    console.error('Run Code Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { questionId, listId, code, language } = req.body;
    const question = await Question.findById(questionId);
    
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // MOCK RESPONSE: Always accepted
    const submission = await Submission.create({
      user: req.user.id,
      question: questionId,
      list: listId || null, // Allow null if no listId is sent
      language,
      code,
      status: 'Accepted',
      passedTests: 10,
      totalTests: 10,
      isCorrect: true
    });

    res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        status: 'Accepted',
        isCorrect: true,
        passedTests: 10,
        totalTests: 10,
        firstFailure: null
      }
    });
  } catch (error) {
    console.error('Submit Code Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};