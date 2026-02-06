import { Navigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useGetProfile'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useProfile()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
