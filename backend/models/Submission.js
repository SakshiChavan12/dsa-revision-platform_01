import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  
  // CHANGE THIS: Made 'code' OPTIONAL, and added 'sourceCode'
  code: { type: String, default: '' },
  sourceCode: { type: String, required: [true, 'Please provide the source code'] },
  
  language: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error', 'Time Limit Exceeded'],
    default: 'Accepted'
  },
  isCorrect: { type: Boolean, default: false },

  executionTime: { type: Number, default: 0 },
  memory: { type: Number, default: 0 },

  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;