import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from './components/ui/sonner'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { PublicRoute } from './components/layout/PublicRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiaryListPage } from './pages/DiaryListPage'
import { DiaryDetailPage } from './pages/DiaryDetailPage'
import { DiaryCreatePage } from './pages/DiaryCreatePage'
import { DiaryEditPage } from './pages/DiaryEditPage'
import { PublicDiariesPage } from './pages/PublicDiariesPage'
import NotFound from './pages/NotFound'
import { ProfilePage } from './pages/ProfilePage'

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
