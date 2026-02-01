import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import diaryReducer from './slices/diarySlice'
import commentReducer from './slices/commentSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
    comment: commentReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
