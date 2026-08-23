import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  topic: { type: String, required: true, trim: true },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['Easy', 'Medium', 'Hard'] 
  },
  platform: { 
    type: String, 
    required: true, 
    enum: ['LeetCode', 'GeeksforGeeks', 'CodeStudio', 'Other'] 
  },
  url: { type: String, default: '' },
  tags: { type: [String], default: [] },
  
  // NEW FIELDS
  examples: [exampleSchema], // Array of input/output/explanation
  constraints: { type: [String], default: [] },
  hints: { type: [String], default: [] }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;