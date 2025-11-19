import { useState } from 'react'
import * as bookmarksApi from '../../api/bookmarks'
import BookmarkEditor from './BookmarkEditor'
import SummaryBox from './SummaryBox'

const BookmarkItem = ({ bookmark, onUpdate, onDelete, showReviewButton, onMarkReviewed }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await bookmarksApi.deleteBookmark(bookmark.id)
        onDelete(bookmark.id)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US')
  }

  const needsRevisit = bookmark.next_review_at && new Date(bookmark.next_review_at) <= new Date()

  return (
    <div className="glass rounded-xl hover:shadow-lg transition flex flex-col h-full">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-2xl flex-shrink-0"
          title={bookmark.url}
        >
          🌐
        </a>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-warm-blue-700 hover:bg-warm-blue-100/50 backdrop-blur-sm rounded transition"
            title={isEditing ? 'Cancel' : 'Edit'}
          >
            {isEditing ? '✖️' : '✏️'}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100/50 backdrop-blur-sm rounded transition"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 break-words">
          {bookmark.title}
        </h3>
      </div>
      
      {/* Revisit Badge */}
      <div className="px-4 pb-3">
        {needsRevisit && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-200/60 backdrop-blur-sm text-orange-800 text-xs rounded-full border border-orange-300/50">
            <span>🔔</span>
            <span>Due for revisit</span>
          </div>
        )}
        {bookmark.next_review_at && !needsRevisit && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-200/60 backdrop-blur-sm text-green-800 text-xs rounded-full border border-green-300/50">
            <span>📅</span>
            <span className="truncate">Next: {formatDate(bookmark.next_review_at)}</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="px-4 pb-4 flex-1">{/* This will push footer to bottom */}

        {/* AI Summary */}
        {bookmark.ai_summary && (
          <div className="mb-3 p-3 bg-purple-100/50 backdrop-blur-sm rounded-lg border border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-800 font-medium text-sm">🤖 AI Summary</span>
            </div>
            <p className="text-gray-800 text-xs whitespace-pre-wrap line-clamp-4">{bookmark.ai_summary}</p>
          </div>
        )}

        {/* Notes */}
        {bookmark.notes && !isEditing && (
          <div className="mb-3 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-800 font-medium text-sm">📝 Notes</span>
            </div>
            <p className="text-gray-800 text-xs whitespace-pre-wrap line-clamp-3">{bookmark.notes}</p>
          </div>
        )}

        {/* Editor Mode */}
        {isEditing && (
          <div className="space-y-3 mt-3 pt-3 border-t border-white/30">
            <BookmarkEditor
              bookmark={bookmark}
              onUpdate={onUpdate}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            
            {/* AI Summary Generation */}
            <SummaryBox bookmark={bookmark} onUpdate={onUpdate} />
          </div>
        )}

        {/* Revisit Button for Review Page */}
        {showReviewButton && onMarkReviewed && needsRevisit && (
          <button
            onClick={() => onMarkReviewed(bookmark.id)}
            className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm"
          >
            ✅ Mark as Revisited
          </button>
        )}
      </div>

      {/* Footer Info - Pushed to bottom */}
      <div className="px-4 pb-3 pt-2 border-t border-white/20 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="truncate">{formatDate(bookmark.created_at)}</span>
          <span className="text-gray-500 truncate ml-2">{bookmark.domain}</span>
        </div>
      </div>
    </div>
  )
}

export default BookmarkItem

