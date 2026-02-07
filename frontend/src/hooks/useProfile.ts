import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux/store'
import { setUser, logout as logoutAction } from '@/redux/slices/authSlice'
import type { User } from '@/types'
export const useProfile = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)
  return {
    user,
    isAuthenticated,
    loading,
    error,
    setUser: (user: User) => dispatch(setUser(user)),
    logout: () => dispatch(logoutAction()),
  }
}
