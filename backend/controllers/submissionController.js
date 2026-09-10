// backend/controllers/submissionController.js
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import PracticeAttempt from '../models/PracticeAttempt.js';

import { executeCode, mapJudge0StatusToAppStatus } from '../services/executionService.js';
import { buildJavaScriptDriver } from '../services/drivers/javascriptDriver.js';
import { compareOutput } from '../services/outputComparator.js';

// ─────────────────────────────────────────────
// Helper: Run one test case and return its result
// ─────────────────────────────────────────────
async function runTest({ userCode, language, functionName, inputParser, outputFormatter, testCase }) {
  // Build executable source
  const sourceCode = buildJavaScriptDriver({
    userCode,
    functionName,
    inputParser,
    outputFormatter
  });

  // Execute
  const result = await executeCode({
    sourceCode,
    language,
    stdin: testCase.input
  });

  const appStatus = mapJudge0StatusToAppStatus(result.statusId);
  const passed = appStatus === 'Accepted' && compareOutput(result.stdout, testCase.expectedOutput);

  return {
    passed,
    appStatus,
    stdout: result.stdout,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    executionTime: result.executionTime,
    memory: result.memory
  };
}

// ─────────────────────────────────────────────
// RUN: only public test cases
// ─────────────────────────────────────────────
export const runCode = async (req, res) => {
  try {
    const { questionId, language = 'javascript', sourceCode } = req.body;

    // 1. Validate request
    if (!questionId || !sourceCode || sourceCode.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'questionId and sourceCode (min 5 chars) are required.'
      });
    }

    // 2. Load question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // 3. Validate execution spec
    if (!question.functionName || !question.inputParser || !question.outputFormatter) {
      return res.status(422).json({
        success: false,
        status: 'Unsupported',
        message: 'This question does not yet have an executable test specification.'
      });
    }

    // 4. Filter public tests only
    const publicTests = question.testCases.filter(tc => !tc.isHidden);
    if (publicTests.length === 0) {
      return res.status(422).json({
        success: false,
        status: 'Unsupported',
        message: 'This question does not yet have public test cases.'
      });
    }

    // 5. Execute each public test
    const testResults = [];
    let passedCount = 0;

    for (let i = 0; i < publicTests.length; i++) {
      const testCase = publicTests[i];

      let outcome;
      try {
        outcome = await runTest({
          userCode: sourceCode,
          language,
          functionName: question.functionName,
          inputParser: question.inputParser,
          outputFormatter: question.outputFormatter,
          testCase
        });
      } catch (execErr) {
        // Driver unsupported, Judge0 unavailable, etc.
        return res.status(422).json({
          success: false,
          status: 'Unsupported',
          message: execErr.message
        });
      }

      if (outcome.passed) passedCount++;

      testResults.push({
        testCase: i + 1,
        passed: outcome.passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: outcome.stdout || outcome.compileOutput || outcome.stderr || '',
        status: outcome.appStatus
      });
    }

    const overallStatus = passedCount === publicTests.length ? 'Accepted' : 'Wrong Answer';

    return res.status(200).json({
      success: true,
      status: overallStatus,
      passed: passedCount,
      total: publicTests.length,
      testResults
    });

  } catch (error) {
    console.error('Run Code Error:', error.message);
    return res.status(500).json({ success: false, message: 'Code execution failed.' });
  }
};

// ─────────────────────────────────────────────
// SUBMIT: all test cases + save submission + record attempt
// ─────────────────────────────────────────────
export const submitCode = async (req, res) => {
  try {
    const { questionId, listId, language = 'javascript', sourceCode } = req.body;

    // 1. Validate request
    if (!questionId || !sourceCode || sourceCode.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'questionId and sourceCode (min 5 chars) are required.'
      });
    }

    // 2. Load question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // 3. Validate execution spec
    if (!question.functionName || !question.inputParser || !question.outputFormatter) {
      return res.status(422).json({
        success: false,
        status: 'Unsupported',
        message: 'This question does not yet have an executable test specification.'
      });
    }

    // 4. All test cases
    const allTests = question.testCases;
    if (allTests.length === 0) {
      return res.status(422).json({
        success: false,
        status: 'Unsupported',
        message: 'This question does not yet have test cases.'
      });
    }

    // 5. Execute all tests
    let passedCount = 0;
    let firstFailure = null;
    let totalTime = 0;
    let maxMemory = 0;

    for (let i = 0; i < allTests.length; i++) {
      const testCase = allTests[i];

      let outcome;
      try {
        outcome = await runTest({
          userCode: sourceCode,
          language,
          functionName: question.functionName,
          inputParser: question.inputParser,
          outputFormatter: question.outputFormatter,
          testCase
        });
      } catch (execErr) {
        // Save as Unsupported submission
        const unsupportedSubmission = await Submission.create({
          user: req.user.id,
          question: questionId,
          list: listId || null,
          sourceCode,
          language,
          status: 'Unsupported',
          isCorrect: false,
          passedTests: 0,
          totalTests: allTests.length,
          error: execErr.message
        });

        return res.status(422).json({
          success: false,
          status: 'Unsupported',
          message: execErr.message
        });
      }

      totalTime += outcome.executionTime;
      maxMemory = Math.max(maxMemory, outcome.memory);

      if (outcome.passed) {
        passedCount++;
      } else if (!firstFailure) {
        firstFailure = {
          testCase: i + 1,
          // only include input/output for non-hidden tests
          ...(testCase.isHidden
            ? { hidden: true }
            : {
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: outcome.stdout || outcome.compileOutput || outcome.stderr || ''
              })
        };
      }
    }

    const isCorrect = passedCount === allTests.length;
    const status = isCorrect ? 'Accepted' : 'Wrong Answer';

    // 6. Save Submission
    const submission = await Submission.create({
      user: req.user.id,
      question: questionId,
      list: listId || null,
      sourceCode,
      language,
      status,
      isCorrect,
      passedTests: passedCount,
      totalTests: allTests.length,
      executionTime: totalTime,
      memory: maxMemory,
      error: firstFailure ? (firstFailure.actualOutput || 'Wrong Answer') : null
    });

    // 7. Record PracticeAttempt (only after submit)
    if (listId) {
      await PracticeAttempt.create({
        user: req.user.id,
        question: questionId,
        list: listId,
        status: isCorrect ? 'Solved' : 'Wrong'
      });
    }

    return res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        status,
        isCorrect,
        passedTests: passedCount,
        totalTests: allTests.length,
        executionTime: totalTime,
        memory: maxMemory,
        firstFailure
      }
    });

  } catch (error) {
    console.error('Submit Code Error:', error.message);
    return res.status(500).json({ success: false, message: 'Code execution failed.' });
  }
};