import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux/store'
import { setUser, logout as logoutAction } from '@/redux/slices/authSlice'
import type { User } from '@/types'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import { useNavigate } from 'react-router-dom'

export const useProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logoutAction())
    } catch (error) {
      dispatch(logoutAction())
      toast.error(getAxiosErrorMessage(error))
    } finally {
      navigate('/login')
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    setUser: (user: User) => dispatch(setUser(user)),
    logout: handleLogout,
  }
}
