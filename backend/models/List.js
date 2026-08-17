import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a list name'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question' // This references your existing Question model
    }
  ]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const List = mongoose.model('List', listSchema);
export default List;