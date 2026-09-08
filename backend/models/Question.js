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
  
  // NEW: Execution metadata
  functionName: { type: String, default: 'solve' }, // The function the user writes
  inputParser: { type: String, default: 'standard' }, // 'standard', 'array', 'tree', 'linkedList'
  outputFormatter: { type: String, default: 'newline' }, // 'newline', 'space', 'array'
  
  testCases: [testCaseSchema]
});


const Question = mongoose.model('Question', questionSchema);
export default Question;