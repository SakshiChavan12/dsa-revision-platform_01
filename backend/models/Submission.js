import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    default: null
  },

  // ─── CODE ───
  sourceCode: {
    type: String,
    required: [true, 'Source code is required']
  },
  language: {
    type: String,
    required: true,
    enum: {
      values: ['javascript', 'python', 'java', 'cpp'],
      message: '"{VALUE}" is not a supported language.'
    }
  },

  // ─── EVALUATION RESULT ───
  status: {
    type: String,
    required: true,
    enum: {
      values: [
        'Accepted',
        'Wrong Answer',
        'Compilation Error',
        'Runtime Error',
        'Time Limit Exceeded',
        'Unsupported'
      ],
      message: '"{VALUE}" is not a valid submission status.'
    }
    // NO default — must always be set explicitly
  },
  isCorrect: {
    type: Boolean,
    required: true
    // NO default — must always be set explicitly
  },

  passedTests: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },

  executionTime: { type: Number, default: 0 }, // ms
  memory: { type: Number, default: 0 },         // KB

  error: { type: String, default: null },

  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;