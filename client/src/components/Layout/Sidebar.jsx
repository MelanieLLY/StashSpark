import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">✨ StashSpark</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/app"
          className={`block px-4 py-3 rounded-lg font-medium transition ${isActive('/app')}`}
        >
          📚 所有书签
        </Link>
        <Link
          to="/app/review"
          className={`block px-4 py-3 rounded-lg font-medium transition ${isActive('/app/review')}`}
        >
          📅 今日复习
        </Link>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          🚪 登出
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

