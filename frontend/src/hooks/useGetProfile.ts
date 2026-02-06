import { useEffect, useState } from 'react'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { useProfile } from './useProfile'

export const useGetProfile = () => {
  const { user, isAuthenticated, logout, setUser } = useProfile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetMe = async () => {
    setLoading(true)
    try {
      const response = await authService.getMe()
      setUser(response.user)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      setError(error.response?.data?.message || 'Login failed')
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetMe()
  }, [])

  return {
    user,
    isAuthenticated,
    loading,
    error,
  }
}
