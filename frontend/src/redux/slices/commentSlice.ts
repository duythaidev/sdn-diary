import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CommentState, Comment } from '@/types'
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
}
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload
      state.loading = false
      state.error = null
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.unshift(action.payload)
      state.loading = false
      state.error = null
    },
    removeComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload)
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})
export const { setComments, addComment, removeComment, setLoading, setError } = commentSlice.actions
export default commentSlice.reducer
