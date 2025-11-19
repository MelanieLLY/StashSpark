import { useState, useEffect } from 'react'
import * as bookmarksApi from '../../api/bookmarks'

const BookmarkEditor = ({ bookmark, onUpdate, isEditing, setIsEditing }) => {
  const [notes, setNotes] = useState(bookmark.notes || '')
  const [reviewInterval, setReviewInterval] = useState(bookmark.review_interval_days || 0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNotes(bookmark.notes || '')
    setReviewInterval(bookmark.review_interval_days || 0)
  }, [bookmark])

  const handleSave = async () => {
    setSaving(true)
    try {
      // 计算下次复习时间
      let nextReviewAt = null
      if (reviewInterval > 0) {
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + reviewInterval)
        // 设置为当天的开始时间（00:00:00），避免时区问题
        nextDate.setHours(0, 0, 0, 0)
        nextReviewAt = nextDate.toISOString()
      }

      const updated = await bookmarksApi.updateBookmark(bookmark.id, {
        notes,
        review_interval_days: reviewInterval,
        next_review_at: nextReviewAt
      })
      
      onUpdate(updated)
      setIsEditing(false)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">📝 Notes</h4>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent transition"
            rows="4"
          />

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Revisit Interval
            </label>
            <select
              value={reviewInterval}
              onChange={(e) => setReviewInterval(Number(e.target.value))}
              className="w-full p-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-warm-blue-400 transition"
            >
              <option value={0}>No revisit schedule</option>
              <option value={1}>After 1 day</option>
              <option value={3}>After 3 days</option>
              <option value={7}>After 7 days</option>
              <option value={14}>After 14 days</option>
              <option value={30}>After 30 days</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-warm-blue-600 text-white rounded-lg hover:bg-warm-blue-700 transition disabled:opacity-50 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setNotes(bookmark.notes || '')
                setReviewInterval(bookmark.review_interval_days || 0)
                setIsEditing(false)
              }}
              className="px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white/70 transition border border-white/40"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 whitespace-pre-wrap">
          {notes || <span className="text-gray-400">No notes yet</span>}
        </div>
      )}
    </div>
  )
}

export default BookmarkEditor

