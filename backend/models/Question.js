import mongoose from 'mongoose';

// ─── SUB-SCHEMAS ───
const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

// ─── VALID ENUMS ───
const VALID_INPUT_PARSERS = [
  // Core
  'array',
  'arrayTarget',
  'arrayK',
  'string',
  'twoStrings',
  'stringArray',
  'number',
  'twoArrays',
  'matrixTarget',

  // Linked Lists
  'linkedList',
  'twoLinkedLists',
  'linkedListN',

  // Trees
  'tree',
  'treeTwoNodes',       // ← NEW: for LCA-type problems

  // Intervals
  'intervalArray',
  'intervalArrayPlus'
];

const VALID_OUTPUT_FORMATTERS = [
  'array',
  'number',
  'boolean',
  'string'
];

// ─── MAIN SCHEMA ───
const questionSchema = new mongoose.Schema({
  // Existing fields (preserve ALL of them!)
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  topic: { type: String, required: true, trim: true },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  platform: { type: String, default: 'LeetCode' },
  url: { type: String, default: '' },
  tags: { type: [String], default: [] },
  examples: [exampleSchema],
  constraints: { type: [String], default: [] },
  hints: { type: [String], default: [] },

  // Execution contract (validated!)
  functionName: {
    type: String,
    required: [true, 'functionName is required for execution'],
    trim: true
  },
  inputParser: {
    type: String,
    required: [true, 'inputParser is required for execution'],
    enum: {
      values: VALID_INPUT_PARSERS,
      message: '"{VALUE}" is not a valid inputParser.'
    }
  },
  outputFormatter: {
    type: String,
    required: [true, 'outputFormatter is required for execution'],
    enum: {
      values: VALID_OUTPUT_FORMATTERS,
      message: '"{VALUE}" is not a valid outputFormatter.'
    }
  },

  testCases: { type: [testCaseSchema], default: [] }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;