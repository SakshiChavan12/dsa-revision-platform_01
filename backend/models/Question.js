import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Please add a difficulty'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  platform: {
    type: String,
    required: [true, 'Please add a platform'],
    enum: ['LeetCode', 'GeeksforGeeks', 'CodeStudio', 'Other']
  },
  url: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Question = mongoose.model('Question', questionSchema);
export default Question;