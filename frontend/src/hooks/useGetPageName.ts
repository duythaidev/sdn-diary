import { useLocation } from 'react-router-dom'
import { getRouteName } from '@/lib/utils'

export const useGetPageName = () => {
  const location = useLocation()
  const pageName = getRouteName(location.pathname)
  return {
    pageName,
    
  }
}
