import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  diaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diary',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;