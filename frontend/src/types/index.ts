export interface User {
  _id: string
  username: string
  email: string
  bio?: string
  profileImage?: string | null
  urls?: Array<{ value: string }>
  createdAt: string
  updatedAt: string
}
export interface Diary {
  _id: string
  title: string
  content: string
  isPublic: boolean
  userId: User | string
  createdAt: string
  updatedAt: string
  allowComments: boolean
  selectedMood: string
  isDraft: boolean
  tags: string[]
  coverPhoto: string | null
  likesCount?: number
  isLiked?: boolean
}
export interface Comment {
  _id: string
  content: string
  userId: User | string
  diaryId: string
  createdAt?: string
}
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
export interface DiaryState {
  diaries: Diary[]
  currentDiary: Diary | null
  publicDiaries: Diary[]
  loading: boolean
  error: string | null
}
export interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

export interface DiaryFormData extends Omit<Diary, '_id' | 'userId' | 'createdAt' | 'updatedAt'> {}
