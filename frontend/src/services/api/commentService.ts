import axiosInstance from './axios';
export const commentService = {
  createComment: async (diaryId: string, content: string) => {
    const response = await axiosInstance.post('/comment', {
      diaryId,
      content,
    });
    return response.data;
  },
  deleteComment: async (id: string) => {
    const response = await axiosInstance.delete(`/comment/${id}`);
    return response.data;
  },
};
