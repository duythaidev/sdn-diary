import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DiaryState, Diary } from '@/types';
const initialState: DiaryState = {
  diaries: [],
  currentDiary: null,
  publicDiaries: [],
  loading: false,
  error: null,
};
const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDiaries: (state, action: PayloadAction<Diary[]>) => {
      state.diaries = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentDiary: (state, action: PayloadAction<Diary | null>) => {
      state.currentDiary = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPublicDiaries: (state, action: PayloadAction<Diary[]>) => {
      state.publicDiaries = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDiary: (state, action: PayloadAction<Diary>) => {
      state.diaries.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateDiary: (state, action: PayloadAction<Diary>) => {
      const index = state.diaries.findIndex(d => d._id === action.payload._id);
      if (index !== -1) {
        state.diaries[index] = action.payload;
      }
      if (state.currentDiary?._id === action.payload._id) {
        state.currentDiary = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeDiary: (state, action: PayloadAction<string>) => {
      state.diaries = state.diaries.filter(d => d._id !== action.payload);
      if (state.currentDiary?._id === action.payload) {
        state.currentDiary = null;
      }
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});
export const {
  setDiaries,
  setCurrentDiary,
  setPublicDiaries,
  addDiary,
  updateDiary,
  removeDiary,
  setLoading,
  setError,
} = diarySlice.actions;
export default diarySlice.reducer;