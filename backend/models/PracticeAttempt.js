import mongoose from 'mongoose';

const practiceAttemptSchema = new mongoose.Schema({
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
    required: true
  },
  status: {
    type: String,
    enum: ['Solved', 'Wrong'],
    required: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

const PracticeAttempt = mongoose.model('PracticeAttempt', practiceAttemptSchema);
export default PracticeAttempt;