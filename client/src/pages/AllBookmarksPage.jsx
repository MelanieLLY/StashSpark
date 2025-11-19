import { useState, useEffect } from 'react'
import * as bookmarksApi from '../api/bookmarks'
import BookmarkList from '../components/bookmarks/BookmarkList'
import AddBookmarkForm from '../components/bookmarks/AddBookmarkForm'

const AllBookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async (search = '') => {
    try {
      setLoading(true)
      const data = await bookmarksApi.getAllBookmarks(search)
      setBookmarks(data)
    } catch (err) {
      setError('加载书签失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    loadBookmarks(query)
  }

  const handleBookmarkAdded = (newBookmark) => {
    setBookmarks([newBookmark, ...bookmarks])
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的书签</h1>
        <p className="text-gray-600">管理和组织你保存的所有内容</p>
      </div>

      {/* 添加书签表单 */}
      <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />

      {/* 搜索框 */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="🔍 搜索书签标题、笔记或 URL..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* 书签列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {searchQuery ? '没有找到匹配的书签' : '还没有书签，快添加第一个吧！'}
          </p>
        </div>
      ) : (
        <BookmarkList
          bookmarks={bookmarks}
          onUpdate={handleBookmarkUpdated}
          onDelete={handleBookmarkDeleted}
        />
      )}
    </div>
  )
}

export default AllBookmarksPage

