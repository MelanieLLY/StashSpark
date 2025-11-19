import { useState } from 'react'
import * as bookmarksApi from '../../api/bookmarks'

const ReviewCalendarCard = ({ bookmark, onMarkReviewed, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleMarkAsReviewed = async () => {
    try {
      await onMarkReviewed(bookmark.id)
    } catch (error) {
      console.error('Failed to mark as reviewed:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        setIsDeleting(true)
        await bookmarksApi.deleteBookmark(bookmark.id)
        onDelete(bookmark.id)
      } catch (error) {
        console.error('Delete failed:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const openUrl = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="glass rounded-xl p-4 hover:shadow-lg transition">
      {/* Title */}
      <div className="flex items-start justify-between mb-3">
        <h4 
          className="font-semibold text-gray-900 flex-1 cursor-pointer hover:text-warm-blue-700 transition"
          onClick={openUrl}
          title="Click to open link"
        >
          {bookmark.title}
        </h4>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-2 text-gray-500 hover:text-red-600 transition text-sm"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* AI Summary */}
      {bookmark.ai_summary ? (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">🤖 AI Summary</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed bg-warm-blue-100/50 backdrop-blur-sm p-3 rounded-lg border border-warm-blue-200/50">
            {bookmark.ai_summary}
          </p>
        </div>
      ) : (
        <div className="mb-3 text-sm text-gray-500 italic">
          No AI summary yet
        </div>
      )}

      {/* Revisit interval info */}
      {bookmark.review_interval_days > 0 && (
        <div className="mb-3 text-xs text-gray-700">
          ⏱️ Revisit interval: {bookmark.review_interval_days} day{bookmark.review_interval_days > 1 ? 's' : ''}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={openUrl}
          className="flex-1 py-2 text-sm bg-warm-blue-600 text-white rounded-lg hover:bg-warm-blue-700 transition shadow-sm"
        >
          🔗 Open Link
        </button>
        <button
          onClick={handleMarkAsReviewed}
          className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          ✅ Mark Revisited
        </button>
      </div>
    </div>
  )
}

export default ReviewCalendarCard

