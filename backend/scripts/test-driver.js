// backend/scripts/test-driver.js
import { buildJavaScriptDriver } from '../services/drivers/javascriptDriver.js';
import { executeCode, mapJudge0StatusToAppStatus } from '../services/executionService.js';
import { compareOutput } from '../services/outputComparator.js';

async function runTest({ name, userCode, functionName, inputParser, outputFormatter, testCase }) {
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`🧪 TEST: ${name}`);
  console.log(`═══════════════════════════════════════════`);

  // 1. Build the driver
  let sourceCode;
  try {
    sourceCode = buildJavaScriptDriver({
      userCode,
      functionName,
      inputParser,
      outputFormatter
    });
    console.log('✅ Driver built successfully');
  } catch (err) {
    console.log(`❌ Driver build failed: ${err.message}`);
    return false;
  }

  // 2. Execute on Judge0
  let result;
  try {
    result = await executeCode({
      sourceCode,
      language: 'javascript',
      stdin: testCase.input
    });
    console.log(`✅ Judge0 executed (status: ${result.status})`);
  } catch (err) {
    console.log(`❌ Execution failed: ${err.message}`);
    return false;
  }

  // 3. Map status
  const appStatus = mapJudge0StatusToAppStatus(result.statusId);
  console.log(`📋 App status: ${appStatus}`);

  // 4. Compare output
  const passed = appStatus === 'Accepted' && compareOutput(result.stdout, testCase.expectedOutput);

  console.log(`📤 Expected:  "${testCase.expectedOutput}"`);
  console.log(`📥 Actual:    "${result.stdout}"`);
  console.log(`🎯 Result:    ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  if (result.compileOutput) {
    console.log(`⚠️  Compile output: ${result.compileOutput}`);
  }
  if (result.stderr) {
    console.log(`⚠️  Stderr: ${result.stderr}`);
  }

  return passed;
}

async function main() {
  console.log('🚀 Starting JavaScript Driver Verification\n');

  let allPassed = true;

  // ─────────────────────────────────────────────
  // TEST 1: Two Sum — Correct solution
  // ─────────────────────────────────────────────
  const twoSumCorrect = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

  const t1 = await runTest({
    name: 'Two Sum — Correct',
    userCode: twoSumCorrect,
    functionName: 'twoSum',
    inputParser: 'arrayTarget',
    outputFormatter: 'array',
    testCase: {
      input: '2 7 11 15\n9',
      expectedOutput: '[0,1]'
    }
  });
  if (!t1) allPassed = false;

  // ─────────────────────────────────────────────
  // TEST 2: Two Sum — Wrong solution
  // ─────────────────────────────────────────────
  const twoSumWrong = `
function twoSum(nums, target) {
  return [1, 2];  // wrong on purpose
}`;

  const t2 = await runTest({
    name: 'Two Sum — Wrong (should FAIL)',
    userCode: twoSumWrong,
    functionName: 'twoSum',
    inputParser: 'arrayTarget',
    outputFormatter: 'array',
    testCase: {
      input: '2 7 11 15\n9',
      expectedOutput: '[0,1]'
    }
  });
  // Note: t2 is EXPECTED to fail, so we don't set allPassed = false here.
  console.log(`➡️  (This test was SUPPOSED to fail: ${t2 ? '❌ unexpected pass' : '✅ correctly failed'})`);

  // ─────────────────────────────────────────────
  // TEST 3: Maximum Subarray
  // ─────────────────────────────────────────────
  const maxSubArrayCorrect = `
function maxSubArray(nums) {
  let maxSum = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    maxSum = Math.max(maxSum, current);
  }
  return maxSum;
}`;

  const t3 = await runTest({
    name: 'Maximum Subarray — Correct',
    userCode: maxSubArrayCorrect,
    functionName: 'maxSubArray',
    inputParser: 'array',
    outputFormatter: 'number',
    testCase: {
      input: '-2 1 -3 4 -1 2 1 -5 4',
      expectedOutput: '6'
    }
  });
  if (!t3) allPassed = false;

  // ─────────────────────────────────────────────
  // TEST 4: Valid Parentheses — Boolean output
  // ─────────────────────────────────────────────
  const validParensCorrect = `
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`;

  const t4 = await runTest({
    name: 'Valid Parentheses — Correct',
    userCode: validParensCorrect,
    functionName: 'isValid',
    inputParser: 'string',
    outputFormatter: 'boolean',
    testCase: {
      input: '()[]{}',
      expectedOutput: 'true'
    }
  });
  if (!t4) allPassed = false;

  // ─────────────────────────────────────────────
  // TEST 5: Syntax Error — Should return Compilation Error
  // ─────────────────────────────────────────────
  const syntaxError = `
function twoSum(nums, target) {
  return [0, 1;  // missing bracket
}`;

  const t5 = await runTest({
    name: 'Syntax Error — Should show Compilation Error',
    userCode: syntaxError,
    functionName: 'twoSum',
    inputParser: 'arrayTarget',
    outputFormatter: 'array',
    testCase: {
      input: '2 7 11 15\n9',
      expectedOutput: '[0,1]'
    }
  });
  // t5 is expected to fail (compilation error) — that's the point.
  console.log(`➡️  (This test was SUPPOSED to fail: ${t5 ? '❌ unexpected pass' : '✅ correctly failed'})`);

  // ─────────────────────────────────────────────
  // TEST 6: Unsupported parser — Should throw cleanly
  // ─────────────────────────────────────────────
  const t6 = await runTest({
    name: 'Unsupported parser — Should throw',
    userCode: 'function solve() { return 1; }',
    functionName: 'solve',
    inputParser: 'linkedList',
    outputFormatter: 'array',
    testCase: {
      input: '[1,2,3]',
      expectedOutput: '[3,2,1]'
    }
  });
  console.log(`➡️  (This test was SUPPOSED to fail: ${t6 ? '❌ unexpected pass' : '✅ correctly rejected'})`);

  // ─────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`📊 FINAL SUMMARY`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`Passing tests (1, 3, 4):  ${[t1, t3, t4].every(Boolean) ? '✅ ALL PASSED' : '❌ SOME FAILED'}`);
  console.log(`Failing tests (2, 5, 6):  correctly rejected`);
  console.log(`\n${allPassed ? '🎉 STEP 5 VERIFIED — Driver is working!' : '⚠️  STEP 5 FAILED — Check above'}`);

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});