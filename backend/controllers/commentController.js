import Comment from "../models/Comment.js";
import Diary from "../models/Diary.js";

export const createComment = async (req, res) => {
  try {
    const { content, diaryId } = req.body;

    const diary = await Diary.findById(diaryId);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (!diary.allowComments) {
      return res
        .status(403)
        .json({ message: "Không thể bình luận vào nhật ký này" });
    }

    const comment = new Comment({
      content,
      diaryId,
      userId: req.user.userId,
    });

    await comment.save();
    await comment.populate("userId", "username email");

    res.status(201).json({
      message: "Thêm bình luận thành công",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    const diary = await Diary.findById(comment.diaryId);

    const isCommentAuthor = comment.userId.toString() === req.user.userId;
    const isDiaryOwner = diary && diary.userId.toString() === req.user.userId;

    if (!isCommentAuthor && !isDiaryOwner) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa bình luận này",
      });
    }

    await Comment.findByIdAndDelete(id);

    res.json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
