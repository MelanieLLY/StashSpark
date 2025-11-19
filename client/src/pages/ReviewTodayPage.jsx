import { useState, useEffect } from 'react'
import * as bookmarksApi from '../api/bookmarks'
import BookmarkList from '../components/bookmarks/BookmarkList'

const ReviewTodayPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReviewBookmarks()
  }, [])

  const loadReviewBookmarks = async () => {
    try {
      setLoading(true)
      const data = await bookmarksApi.getReviewToday()
      setBookmarks(data)
    } catch (err) {
      setError('加载复习列表失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsReviewed = async (id) => {
    try {
      await bookmarksApi.markAsReviewed(id)
      // 从列表中移除已复习的书签
      setBookmarks(bookmarks.filter(b => b.id !== id))
    } catch (err) {
      console.error('标记复习失败:', err)
    }
  }

  const handleBookmarkUpdated = (updatedBookmark) => {
    setBookmarks(bookmarks.map(b => 
      b.id === updatedBookmark.id ? updatedBookmark : b
    ))
  }

  const handleBookmarkDeleted = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 今日复习</h1>
        <p className="text-gray-600">
          {bookmarks.length > 0 
            ? `今天有 ${bookmarks.length} 个书签需要复习` 
            : '今天没有需要复习的书签'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-700 text-lg mb-2">太棒了！</p>
          <p className="text-gray-500">今天没有需要复习的内容</p>
        </div>
      ) : (
        <BookmarkList
          bookmarks={bookmarks}
          onUpdate={handleBookmarkUpdated}
          onDelete={handleBookmarkDeleted}
          showReviewButton={true}
          onMarkReviewed={handleMarkAsReviewed}
        />
      )}
    </div>
  )
}

export default ReviewTodayPage

