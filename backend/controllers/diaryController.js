import Diary from "../models/Diary.js";
import Comment from "../models/Comment.js";
import { subDays, subMonths, subYears } from "../utils/date.js";

const MAX_COVER_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_USER_DIARIES_PER_PAGE = 10;
const MAX_PUBLIC_DIARIES_PER_PAGE = 12;
const RECENT_DIARIES_LIMIT = 3;

export const getUserDiaries = async (req, res) => {
  try {
    const {
      dateFilter,
      moodFilter,
      tagsFilter,
      queryFilter,
      statusFilter, // 'all' | 'public' | 'private' | 'draft'
      page = 1,
      limit = MAX_USER_DIARIES_PER_PAGE,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { userId: req.user.userId };

    // Date filter (specific date)
    if (req.query.date) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Mood filter
    if (moodFilter && moodFilter !== "all") {
      query.selectedMood = moodFilter;
    }

    // Tags filter
    if (tagsFilter && tagsFilter !== "all") {
      query.tags = { $in: [tagsFilter] };
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "draft") {
        query.isDraft = true;
      } else if (statusFilter === "public") {
        query.isDraft = false;
        query.isPublic = true;
      } else if (statusFilter === "private") {
        query.isDraft = false;
        query.isPublic = false;
      }
    }

    // Query filter
    if (queryFilter) {
      query.$or = [
        { title: { $regex: queryFilter, $options: "i" } },
        { content: { $regex: queryFilter, $options: "i" } },
      ];
    }

    const totalCount = await Diary.countDocuments(query);

    const sortBy = dateFilter === "newest" ? -1 : 1;
    const diaries = await Diary.find(query)
      .sort({ createdAt: sortBy })
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "username email");

    const hasMore = skip + diaries.length < totalCount;

    res.json({
      diaries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasMore,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getUserRecentDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .limit(RECENT_DIARIES_LIMIT)
      .populate("userId", "username email");
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getUserPublishedDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({
      userId: req.user.userId,
      isDraft: false,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getUserDrafts = async (req, res) => {
  try {
    const diaries = await Diary.find({
      userId: req.user.userId,
      isDraft: true,
    })
      .sort({ updatedAt: -1 })
      .populate("userId", "username email");
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getPublicDiaries = async (req, res) => {
  const {
    isMostLiked,
    queryFilter,
    page = 1,
    limit = MAX_PUBLIC_DIARIES_PER_PAGE,
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (queryFilter) {
    query.$or = [
      { title: { $regex: queryFilter, $options: "i" } },
      { content: { $regex: queryFilter, $options: "i" } },
    ];
  }

  const sortQuery =
    isMostLiked === "true"
      ? { likesCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  try {
    const baseQuery = {
      isPublic: true,
      isDraft: false,
      ...query,
    };

    const totalCount = await Diary.countDocuments(baseQuery);

    const diaries = await Diary.find(baseQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "username email");

    const hasMore = skip + diaries.length < totalCount;

    res.json({
      diaries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasMore,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id)
      .populate("userId", "username email bio profileImage")
      .populate("likes", "username email bio profileImage");

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (
      (!diary.isPublic || diary.isDraft) &&
      diary.userId._id.toString() !== req.user?.userId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const isLiked = req.user?.userId
      ? diary.likes.some((like) => like._id.toString() === req.user.userId)
      : false;

    let comments = [];
    if (diary.allowComments && !diary.isDraft) {
      comments = await Comment.find({ diaryId: id })
        .sort({ createdAt: -1 })
        .populate("userId", "username email");
    }

    res.json({
      diary: {
        ...diary.toObject(),
        isLiked,
      },
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const createDiary = async (req, res) => {
  try {
    const {
      title,
      content,
      isPublic,
      allowComments,
      selectedMood,
      tags,
      coverPhoto,
      isDraft,
    } = req.body;

    if (coverPhoto && coverPhoto.length > MAX_COVER_PHOTO_SIZE) {
      return res
        .status(400)
        .json({ message: "Ảnh bìa quá lớn. Dung lượng tối đa là 5MB." });
    }

    const diary = new Diary({
      title,
      content,
      isPublic: isPublic || false,
      allowComments: allowComments !== undefined ? allowComments : true,
      selectedMood: selectedMood || "happy",
      tags: tags || [],
      coverPhoto: coverPhoto || null,
      isDraft: isDraft || false,
      userId: req.user.userId,
      likes: [],
      likesCount: 0,
    });

    await diary.save();
    await diary.populate("userId", "username email");

    res.status(201).json({
      message: isDraft ? "Đã lưu nháp thành công" : "Tạo nhật ký thành công",
      diary,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Lỗi xác thực dữ liệu",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isPublic,
      allowComments,
      selectedMood,
      tags,
      coverPhoto,
      isDraft,
    } = req.body;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (diary.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Không có quyền chỉnh sửa nhật ký này" });
    }

    if (coverPhoto && coverPhoto.length > MAX_COVER_PHOTO_SIZE) {
      return res
        .status(400)
        .json({ message: "Ảnh bìa quá lớn. Dung lượng tối đa là 5MB." });
    }

    if (title !== undefined) diary.title = title;
    if (content !== undefined) diary.content = content;
    if (isPublic !== undefined) diary.isPublic = isPublic;
    if (allowComments !== undefined) diary.allowComments = allowComments;
    if (selectedMood !== undefined) diary.selectedMood = selectedMood;
    if (tags !== undefined) diary.tags = tags;
    if (coverPhoto !== undefined) diary.coverPhoto = coverPhoto;
    if (isDraft !== undefined) diary.isDraft = isDraft;

    diary.updatedAt = Date.now();

    await diary.save();
    await diary.populate("userId", "username email");

    res.json({
      message: isDraft
        ? "Đã lưu nháp thành công"
        : "Cập nhật nhật ký thành công",
      diary,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Lỗi xác thực dữ liệu",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (diary.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Không có quyền xóa nhật ký này" });
    }

    await diary.deleteOne();
    await Comment.deleteMany({ diaryId: id });

    res.json({ message: "Xóa nhật ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const likeDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (!diary.isPublic || diary.isDraft) {
      return res
        .status(403)
        .json({ message: "Không thể thích nhật ký riêng tư hoặc nháp" });
    }

    const alreadyLiked = diary.likes.includes(userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Bạn đã thích nhật ký này rồi" });
    }

    diary.likes.push(userId);
    diary.likesCount = diary.likes.length;
    await diary.save();

    res.json({
      message: "Thích nhật ký thành công",
      likesCount: diary.likesCount,
      isLiked: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const unlikeDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    const likeIndex = diary.likes.indexOf(userId);

    if (likeIndex === -1) {
      return res.status(400).json({ message: "Bạn chưa thích nhật ký này" });
    }

    diary.likes.splice(likeIndex, 1);
    diary.likesCount = diary.likes.length;
    await diary.save();

    res.json({
      message: "Bỏ thích nhật ký thành công",
      likesCount: diary.likesCount,
      isLiked: false,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (!diary.isPublic || diary.isDraft) {
      return res
        .status(403)
        .json({ message: "Không thể thích nhật ký riêng tư hoặc nháp" });
    }

    const likeIndex = diary.likes.indexOf(userId);
    let isLiked;

    if (likeIndex > -1) {
      diary.likes.splice(likeIndex, 1);
      diary.likesCount = diary.likes.length;
      isLiked = false;
    } else {
      diary.likes.push(userId);
      diary.likesCount = diary.likes.length;
      isLiked = true;
    }

    await diary.save();

    res.json({
      message: isLiked
        ? "Thích nhật ký thành công"
        : "Bỏ thích nhật ký thành công",
      likesCount: diary.likesCount,
      isLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const publishDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Không tìm thấy nhật ký" });
    }

    if (diary.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Không có quyền đăng nhật ký này" });
    }

    if (!diary.isDraft) {
      return res
        .status(400)
        .json({ message: "Nhật ký này đã được đăng công khai" });
    }

    diary.isDraft = false;
    diary.updatedAt = Date.now();

    await diary.save();
    await diary.populate("userId", "username email");

    res.json({
      message: "Đăng nhật ký thành công",
      diary,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getDiariesByMood = async (req, res) => {
  try {
    const { mood } = req.params;

    const validMoods = ["stressed", "okay", "calm", "happy", "great"];
    if (!validMoods.includes(mood)) {
      return res
        .status(400)
        .json({ message: "Giá trị tâm trạng không hợp lệ" });
    }

    const diaries = await Diary.find({
      userId: req.user.userId,
      selectedMood: mood,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    res.json({ diaries, mood });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy nhật ký theo tag (loại trừ nháp)
export const getDiariesByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const diaries = await Diary.find({
      tags: tag.toLowerCase(),
      isPublic: true,
      isDraft: false,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    res.json({ diaries, tag });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { range = "last7" } = req.query;

    // Xác định khoảng thời gian cho biểu đồ hoạt động
    const now = new Date();
    let rangeStart;
    let daysCount;
    if (range === "lastmonth") {
      rangeStart = subMonths(now, 1);
      daysCount = 30;
    } else if (range === "lastyear") {
      rangeStart = subYears(now, 1);
      daysCount = 365;
    } else {
      // mặc định: last7
      rangeStart = subDays(now, 6);
      daysCount = 7;
    }

    // Tất cả nhật ký của người dùng (dùng để tính thống kê)
    const allDiaries = await Diary.find({ userId }).select(
      "_id createdAt selectedMood isDraft isPublic",
    );

    const totalEntries = allDiaries.length;

    // Tổng số bình luận trên nhật ký của người dùng
    const diaryIds = allDiaries.map((d) => d._id);
    const totalComments = await Comment.countDocuments({
      diaryId: { $in: diaryIds },
    });

    // Chuỗi streak: số ngày liên tiếp có ít nhất 1 bài viết (tính ngược từ hôm nay)
    let streak = 0;
    let checkDate = new Date();
    const createdDates = allDiaries.map((d) => new Date(d.createdAt));
    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    while (true) {
      const hasEntry = createdDates.some((d) => isSameDay(d, checkDate));
      if (!hasEntry) break;
      streak++;
      checkDate = subDays(checkDate, 1);
    }

    // Tâm trạng xuất hiện nhiều nhất
    const moodCounts = {};
    allDiaries.forEach((d) => {
      if (d.selectedMood)
        moodCounts[d.selectedMood] = (moodCounts[d.selectedMood] || 0) + 1;
    });
    const topMood =
      Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // Dữ liệu hoạt động cho biểu đồ (nhóm theo ngày/tuần/tháng tùy range)
    let activityData = [];
    if (range === "lastyear") {
      // Nhóm theo tháng (12 khoảng)
      activityData = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(now, 11 - i);
        const year = date.getFullYear();
        const month = date.getMonth();
        const entries = allDiaries.filter((d) => {
          const cd = new Date(d.createdAt);
          return cd.getFullYear() === year && cd.getMonth() === month;
        }).length;
        return {
          name: date.toLocaleString("vi-VN", { month: "long" }),
          "Bài viết": entries,
        };
      });
    } else {
      // Nhóm theo ngày
      activityData = Array.from({ length: daysCount }, (_, i) => {
        const day = subDays(now, daysCount - 1 - i);
        const entries = allDiaries.filter((d) =>
          isSameDay(new Date(d.createdAt), day),
        ).length;
        const name =
          daysCount <= 7
            ? day.toLocaleString("vi-VN", { weekday: "long" })
            : `${day.getMonth() + 1}/${day.getDate()}`;
        return { name, "Bài viết": entries };
      });
    }

    // Nháp gần đây (mới nhất 3)
    const recentDrafts = await Diary.find({ userId, isDraft: true })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("_id title content createdAt updatedAt isDraft");

    // Bài viết công khai gần đây (mới nhất 3)
    const recentPublic = await Diary.find({
      userId,
      isPublic: true,
      isDraft: false,
    })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select(
        "_id title content createdAt updatedAt isPublic selectedMood tags",
      );

    res.json({
      stats: {
        totalEntries,
        totalComments,
        streak,
        topMood,
      },
      activityData,
      recentDrafts,
      recentPublic,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
