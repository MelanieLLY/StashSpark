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
      setError('请输入 URL')
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
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">➕ 添加新书签</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴 URL..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题（可选）"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '添加中...' : '添加书签'}
        </button>
      </form>
    </div>
  )
}

export default AddBookmarkForm

