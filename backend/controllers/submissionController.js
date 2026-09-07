// backend/controllers/submissionController.js
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import { createSubmission, getSubmissionResult, processJudge0Result, LANGUAGE_IDS } from '../services/executionService.js';

// @desc    Run code against PUBLIC test cases
// @route   POST /api/code/run
export const runCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;

    if (!questionId || !language || !code) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) return res.status(400).json({ success: false, message: 'Language not supported' });

    const publicTests = question.testCases.filter(tc => !tc.isHidden);
    if (publicTests.length === 0) {
      return res.status(400).json({ success: false, message: 'This question does not have public test cases configured yet.' });
    }

    const results = [];
    let passed = 0;

    for (let i = 0; i < publicTests.length; i++) {
      const test = publicTests[i];
      
      // Send to Judge0
      const token = await createSubmission(code, languageId, test.input);
      const judge0Result = await getSubmissionResult(token);
      const result = processJudge0Result(judge0Result);
      
      const passedTest = result.isCorrect;
      if (passedTest) passed++;

      results.push({
        testCase: i + 1,
        passed: passedTest,
        input: test.input,
        expectedOutput: test.expectedOutput,
        actualOutput: result.stdout || result.compileError || result.stderr,
        status: result.status
      });
    }

    res.status(200).json({
      success: true,
      status: passed === publicTests.length ? 'Accepted' : 'Wrong Answer',
      passed,
      total: publicTests.length,
      results
    });
  } catch (error) {
    console.error('Run Code Error:', error.message);
    res.status(500).json({ success: false, message: 'Code execution failed. Please try again.' });
  }
};

// @desc    Submit code against ALL test cases (including hidden)
// @route   POST /api/code/submit
export const submitCode = async (req, res) => {
  try {
    const { questionId, listId, language, code } = req.body;

    if (!questionId || !language || !code) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) return res.status(400).json({ success: false, message: 'Language not supported' });

    const allTests = question.testCases;
    if (allTests.length === 0) {
      return res.status(400).json({ success: false, message: 'This question does not have test cases configured yet.' });
    }

    let passed = 0;
    const total = allTests.length;
    let firstFailure = null;

    for (const test of allTests) {
      // Send to Judge0
      const token = await createSubmission(code, languageId, test.input);
      const judge0Result = await getSubmissionResult(token);
      const result = processJudge0Result(judge0Result);
      
      const passedTest = result.isCorrect;
      if (passedTest) {
        passed++;
      } else if (!firstFailure) {
        firstFailure = {
          testCase: allTests.indexOf(test) + 1,
          expectedOutput: test.expectedOutput,
          actualOutput: result.stdout || result.compileError || result.stderr
        };
      }
    }

    const status = passed === total ? 'Accepted' : 'Wrong Answer';

    // Save Submission
    const submission = await Submission.create({
      user: req.user.id,
      question: questionId,
      list: listId || null,
      language,
      code,
      status,
      passedTests: passed,
      totalTests: total,
      runtime: 0,
      memory: 0,
      error: firstFailure ? firstFailure.actualOutput : null
    });

    res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        status,
        isCorrect: status === 'Accepted',
        passedTests: passed,
        totalTests: total,
        firstFailure
      }
    });
  } catch (error) {
    console.error('Submit Code Error:', error.message);
    res.status(500).json({ success: false, message: 'Code execution failed. Please try again.' });
  }
};