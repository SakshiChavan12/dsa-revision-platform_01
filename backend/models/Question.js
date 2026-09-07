import mongoose from 'mongoose';

// ... existing code ...

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

// ... add these to your main questionSchema:
const questionSchema = new mongoose.Schema({
  // ... existing fields ...
  examples: [exampleSchema], // Already exists
  testCases: [testCaseSchema], // NEW
  starterCode: {
    javascript: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' }
  }
});


const Question = mongoose.model('Question', questionSchema);
export default Question;