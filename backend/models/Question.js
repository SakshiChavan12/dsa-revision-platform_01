import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a title'] },
  description: { type: String, required: [true, 'Please add a description'] },
  topic: { type: String, required: [true, 'Please add a topic'] },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['Easy', 'Medium', 'Hard'] 
  },
  platform: { type: String, default: 'LeetCode' },
  url: { type: String },
  examples: [exampleSchema], // Array of sub-documents
  constraints: { type: String },
  solution: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;