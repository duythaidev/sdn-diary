import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export const RouteChangeTracker = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [location])

  return null
}
