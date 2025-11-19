import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AllBookmarksPage from './pages/AllBookmarksPage'
import ReviewTodayPage from './pages/ReviewTodayPage'
import AppLayout from './components/Layout/AppLayout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* 受保护的路由 */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AllBookmarksPage />} />
            <Route path="review" element={<ReviewTodayPage />} />
          </Route>
          
          {/* 默认重定向到登录页 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

