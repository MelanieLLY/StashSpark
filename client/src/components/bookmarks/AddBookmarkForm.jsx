import { useState } from 'react'
import * as bookmarksApi from '../../api/bookmarks'

const AddBookmarkForm = ({ onBookmarkAdded }) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const newBookmark = await bookmarksApi.createBookmark({
        url,
        title: title || undefined
      })
      
      onBookmarkAdded(newBookmark)
      setUrl('')
      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">➕ Add New Bookmark</h2>
      
      {/* 自动功能提示 */}

      
      {error && (
        <div className="mb-4 bg-red-100/70 backdrop-blur-sm text-red-800 p-3 rounded-lg text-sm border border-red-200/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Leave empty to auto-fetch"
            className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent transition"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Leave blank to auto-fetch title, description & AI summary
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-warm-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-warm-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? '⏳ Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}

export default AddBookmarkForm

