import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/sonner'
import AppLayout from './components/layout/AppLayout'

const ProtectedRoute = lazy(() =>
  import('./components/layout/ProtectedRoute').then((module) => ({ default: module.ProtectedRoute })),
)
const PublicRoute = lazy(() =>
  import('./components/layout/PublicRoute').then((module) => ({ default: module.PublicRoute })),
)
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const DiaryListPage = lazy(() => import('./pages/DiaryListPage').then((module) => ({ default: module.DiaryListPage })))
const DiaryDetailPage = lazy(() =>
  import('./pages/DiaryDetailPage').then((module) => ({ default: module.DiaryDetailPage })),
)
const DiaryCreatePage = lazy(() =>
  import('./pages/DiaryCreatePage').then((module) => ({ default: module.DiaryCreatePage })),
)
const DiaryEditPage = lazy(() => import('./pages/DiaryEditPage').then((module) => ({ default: module.DiaryEditPage })))
const PublicDiariesPage = lazy(() =>
  import('./pages/PublicDiariesPage').then((module) => ({ default: module.PublicDiariesPage })),
)
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const ForgotPasswordPage = lazy(() =>
  import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('./pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })),
)

function AppContent() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Layout wrapped routes */}
        <Route element={<AppLayout />}>
          {/* Public diaries - accessible to all */}
          <Route path="/" element={<PublicDiariesPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary"
            element={
              <ProtectedRoute>
                <DiaryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary/create"
            element={
              <ProtectedRoute>
                <DiaryCreatePage />
              </ProtectedRoute>
            }
          />
          <Route path="/diary/:id" element={<DiaryDetailPage />} />
          <Route
            path="/diary/:id/edit"
            element={
              <ProtectedRoute>
                <DiaryEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  )
}

export default App
