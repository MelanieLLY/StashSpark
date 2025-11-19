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
      console.error('保存失败:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">📝 笔记</h4>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            编辑
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="在这里记录你的想法..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              复习间隔
            </label>
            <select
              value={reviewInterval}
              onChange={(e) => setReviewInterval(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>不设置复习</option>
              <option value={1}>1 天后</option>
              <option value={3}>3 天后</option>
              <option value={7}>7 天后</option>
              <option value={14}>14 天后</option>
              <option value={30}>30 天后</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
            <button
              onClick={() => {
                setNotes(bookmark.notes || '')
                setReviewInterval(bookmark.review_interval_days || 0)
                setIsEditing(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 whitespace-pre-wrap">
          {notes || <span className="text-gray-400">暂无笔记</span>}
        </div>
      )}
    </div>
  )
}

export default BookmarkEditor

