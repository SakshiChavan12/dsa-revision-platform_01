import Bookmark from '../models/Bookmark.js';
import Question from '../models/Question.js';

// @desc    Toggle bookmark for a question
// @route   POST /api/bookmarks/:questionId
export const toggleBookmark = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const existingBookmark = await Bookmark.findOne({ user: userId, question: questionId });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      return res.status(200).json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    } else {
      await Bookmark.create({ user: userId, question: questionId });
      return res.status(201).json({ success: true, bookmarked: true, message: 'Bookmark added' });
    }
  } catch (error) {
    console.error('Toggle Bookmark Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all bookmarks for the logged-in user
// @route   GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('question')
      .sort({ createdAt: -1 });

    // Filter out bookmarks where the question was deleted
    const validBookmarks = bookmarks.filter(b => b.question !== null);

    res.status(200).json({
      success: true,
      count: validBookmarks.length,
      bookmarks: validBookmarks.map(b => b.question)
    });
  } catch (error) {
    console.error('Get Bookmarks Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};