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
      
      {error && (
        <div className="mb-4 bg-red-100/70 backdrop-blur-sm text-red-800 p-3 rounded-lg text-sm border border-red-200/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL..."
            className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-warm-blue-600 text-white py-2 rounded-lg font-medium hover:bg-warm-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}

export default AddBookmarkForm

