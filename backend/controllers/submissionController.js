// backend/controllers/submissionController.js
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import PracticeAttempt from '../models/PracticeAttempt.js';
import { submitBatch, submitToken, mapJudge0StatusToAppStatus } from '../services/executionService.js';
import { normalizeLanguage, getLanguageById } from '../services/languageRegistry.js';
import { compareOutput } from '../services/outputComparator.js';

export const runCode = async (req, res) => {
  try {
    const { questionId, language, sourceCode } = req.body;

    if (!questionId || !sourceCode) {
      return res.status(400).json({ success: false, message: 'Missing fields.' });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    const normalizedLang = normalizeLanguage(language);
    const languageId = getLanguageById(normalizedLang);
    if (!languageId) return res.status(400).json({ success: false, message: 'Unsupported language.' });

    const publicTests = question.testCases.filter(tc => !tc.isHidden);
    
    // Send direct source code, no drivers
    const submissions = publicTests.map((testcase) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testcase.input || "",
      expected_output: testcase.expectedOutput || "",
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResultsRaw = await submitToken(resultToken);

    let passedCount = 0;
    const testResults = testResultsRaw.map((test, i) => {
      const appStatus = mapJudge0StatusToAppStatus(test.status_id);
      const passed = test.status_id === 3 && compareOutput(test.stdout, publicTests[i].expectedOutput);
      if (passed) passedCount++;

      return {
        testCase: i + 1,
        passed,
        input: publicTests[i].input,
        expectedOutput: publicTests[i].expectedOutput,
        actualOutput: test.stdout || test.compile_output || test.stderr || '',
        status: appStatus
      };
    });

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

export const submitCode = async (req, res) => {
  try {
    const { questionId, listId, language, sourceCode } = req.body;

    if (!questionId || !sourceCode) {
      return res.status(400).json({ success: false, message: 'Missing fields.' });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    const normalizedLang = normalizeLanguage(language);
    const languageId = getLanguageById(normalizedLang);
    if (!languageId) return res.status(400).json({ success: false, message: 'Unsupported language.' });

    const allTests = question.testCases;
    
    const submissions = allTests.map((testcase) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testcase.input || "",
      expected_output: testcase.expectedOutput || "",
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResultsRaw = await submitToken(resultToken);

    let passedCount = 0;
    let firstFailure = null;

    for (let i = 0; i < testResultsRaw.length; i++) {
      const test = testResultsRaw[i];
      const appStatus = mapJudge0StatusToAppStatus(test.status_id);
      const passed = test.status_id === 3 && compareOutput(test.stdout, allTests[i].expectedOutput);
      
      if (passed) {
        passedCount++;
      } else if (!firstFailure) {
        firstFailure = {
          testCase: i + 1,
          hidden: allTests[i].isHidden,
          ...(allTests[i].isHidden ? {} : {
            input: allTests[i].input,
            expectedOutput: allTests[i].expectedOutput,
            actualOutput: test.stdout || test.compile_output || test.stderr || ''
          })
        };
      }
    }

    const isCorrect = passedCount === allTests.length;
    const status = isCorrect ? 'Accepted' : 'Wrong Answer';

    const submission = await Submission.create({
      user: req.user.id,
      question: questionId,
      list: listId || null,
      sourceCode,
      language: normalizedLang,
      status,
      isCorrect,
      passedTests: passedCount,
      totalTests: allTests.length,
      error: firstFailure ? (firstFailure.actualOutput || 'Wrong Answer') : null
    });

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
        firstFailure
      }
    });

  } catch (error) {
    console.error('Submit Code Error:', error.message);
    return res.status(500).json({ success: false, message: 'Code execution failed.' });
  }
};