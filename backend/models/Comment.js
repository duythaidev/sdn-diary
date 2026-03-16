import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Nội dung bình luận là bắt buộc'],
    trim: true,
    maxlength: [500, 'Bình luận không được vượt quá 500 ký tự'],
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
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;