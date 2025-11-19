import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="w-64 glass flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-white/30">
        <h1 className="text-2xl font-bold text-gray-900">✨ StashSpark</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/app"
          className={`block px-4 py-3 rounded-lg font-medium transition ${isActive('/app') ? 'bg-warm-blue-300/50 text-warm-blue-800 shadow-sm' : 'text-gray-700 hover:bg-white/40'}`}
        >
          📚 All Bookmarks
        </Link>
        <Link
          to="/app/review"
          className={`block px-4 py-3 rounded-lg font-medium transition ${isActive('/app/review') ? 'bg-warm-blue-300/50 text-warm-blue-800 shadow-sm' : 'text-gray-700 hover:bg-white/40'}`}
        >
          📅 Revisit Today
        </Link>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-white/30">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50/60 rounded-lg transition backdrop-blur-sm"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

