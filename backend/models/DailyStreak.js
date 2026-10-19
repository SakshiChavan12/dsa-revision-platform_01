// backend/models/DailyStreak.js
import mongoose from 'mongoose';

const dailyStreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate completions on the same day for the same user
dailyStreakSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyStreak = mongoose.model('DailyStreak', dailyStreakSchema);
export default DailyStreak;