import { useEffect, useState } from 'react'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { useProfile } from './useProfile'
import { getAxiosErrorMessage } from '@/lib/error'

export const useGetProfile = () => {
  const { user, isAuthenticated, logout, setUser } = useProfile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetMe = async () => {
    setLoading(true)
    try {
      const response = await authService.getMe()
      setUser(response.user)
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error)
      toast.error(errorMessage)
      setError(errorMessage)
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
