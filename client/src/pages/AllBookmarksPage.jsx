import { useState, useEffect } from 'react'
import * as bookmarksApi from '../api/bookmarks'
import BookmarkList from '../components/bookmarks/BookmarkList'
import AddBookmarkForm from '../components/bookmarks/AddBookmarkForm'
import TagFilter from '../components/bookmarks/TagFilter'

const AllBookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadBookmarks()
  }, [])

  // 应用过滤器
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredBookmarks(bookmarks)
      return
    }

    // 过滤出包含任一选中标签的书签
    const filtered = bookmarks.filter(bookmark => {
      if (!bookmark.tags || bookmark.tags.length === 0) {
        return false
      }
      return bookmark.tags.some(tag => selectedTags.includes(tag.id))
    })

    setFilteredBookmarks(filtered)
  }, [bookmarks, selectedTags])

  const loadBookmarks = async (search = '') => {
    try {
      setLoading(true)
      const data = await bookmarksApi.getAllBookmarks(search)
      setBookmarks(data)
    } catch (err) {
      setError('Failed to load bookmarks')
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

  const handleTagFilterChange = (tags) => {
    setSelectedTags(tags)
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
    <div className="max-w-[1920px] mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
        <p className="text-gray-600">Manage and organize all your saved content</p>
      </div>

      {/* 添加书签表单 */}
      <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />

      {/* Search box */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="🔍 Search bookmark title, notes, or URL..."
          className="w-full px-4 py-3 glass border-white/40 rounded-xl focus:ring-2 focus:ring-warm-blue-400 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Tag filter */}
      <TagFilter 
        selectedTags={selectedTags}
        onFilterChange={handleTagFilterChange}
      />

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 bg-red-100/70 backdrop-blur-sm text-red-800 p-4 rounded-xl border border-red-200/50">
          {error}
        </div>
      )}

      {/* Bookmark list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-700">Loading...</div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl shadow-sm">
          <p className="text-gray-700">
            {searchQuery ? 'No matching bookmarks found' : 'No bookmarks yet, add your first one!'}
          </p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl shadow-sm">
          <p className="text-gray-700">
            No bookmarks found with the selected tags
          </p>
          <button
            onClick={() => setSelectedTags([])}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Clear tag filters
          </button>
        </div>
      ) : (
        <BookmarkList
          bookmarks={filteredBookmarks}
          onUpdate={handleBookmarkUpdated}
          onDelete={handleBookmarkDeleted}
        />
      )}
    </div>
  )
}

export default AllBookmarksPage

