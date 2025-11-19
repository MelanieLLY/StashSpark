import { useState } from 'react'
import * as bookmarksApi from '../../api/bookmarks'
import BookmarkEditor from './BookmarkEditor'
import SummaryBox from './SummaryBox'

const BookmarkItem = ({ bookmark, onUpdate, onDelete, showReviewButton, onMarkReviewed }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个书签吗？')) {
      try {
        await bookmarksApi.deleteBookmark(bookmark.id)
        onDelete(bookmark.id)
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {bookmark.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>🌐 {bookmark.domain}</span>
            <span>📅 {formatDate(bookmark.created_at)}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
          >
            删除
          </button>
        </div>
      </div>

      {/* URL */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline break-all"
      >
        {bookmark.url}
      </a>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Editor */}
          <BookmarkEditor
            bookmark={bookmark}
            onUpdate={onUpdate}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

          {/* AI Summary */}
          <SummaryBox bookmark={bookmark} onUpdate={onUpdate} />

          {/* Review Button */}
          {showReviewButton && onMarkReviewed && (
            <button
              onClick={() => onMarkReviewed(bookmark.id)}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✅ 标记为已复习
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default BookmarkItem

