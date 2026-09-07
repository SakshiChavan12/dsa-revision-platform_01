// backend/controllers/codeController.js
import { createSubmission, getSubmissionResult, processJudge0Result, LANGUAGE_IDS } from '../services/executionService.js';

// @desc    Test run simple code
// @route   POST /api/code/test
export const testCode = async (req, res) => {
  try {
    const { sourceCode, language = 'javascript', stdin = '' } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ success: false, message: 'sourceCode is required' });
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({ success: false, message: `Language ${language} not supported` });
    }

    // 1. Send to Judge0
    const token = await createSubmission(sourceCode, languageId, stdin);

    // 2. Poll for result
    const judge0Result = await getSubmissionResult(token);

    // 3. Process result
    const result = processJudge0Result(judge0Result);

    // 4. Return clean result
    res.status(200).json({
      success: true,
      status: result.status,
      stdout: result.stdout || result.compileError || result.stderr,
      stderr: result.stderr || '',
      time: result.time,
      memory: result.memory
    });

  } catch (error) {
    console.error('Code test error:', error.message);
    res.status(500).json({ success: false, message: 'Code execution failed. Please try again.' });
  }
};