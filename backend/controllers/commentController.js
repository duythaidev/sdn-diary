import Comment from '../models/Comment.js';
import Diary from '../models/Diary.js';
// Create comment
export const createComment = async (req, res) => {
  try {
    const { content, diaryId } = req.body;
    // Check if diary exists and is public
    const diary = await Diary.findById(diaryId);
    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }
    if (!diary.isPublic) {
      return res.status(403).json({ message: 'Cannot comment on private diary' });
    }
    const comment = new Comment({
      content,
      diaryId,
      userId: req.user.userId,
    });
    await comment.save();
    await comment.populate('userId', 'username email');
    res.status(201).json({ 
      message: 'Comment added successfully', 
      comment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    // Get the diary to check ownership
    const diary = await Diary.findById(comment.diaryId);
    // Check if user is the comment author or diary owner
    const isCommentAuthor = comment.userId.toString() === req.user.userId;
    const isDiaryOwner = diary && diary.userId.toString() === req.user.userId;
    if (!isCommentAuthor && !isDiaryOwner) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this comment' 
      });
    }
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
