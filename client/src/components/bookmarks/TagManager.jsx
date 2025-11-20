import { useState, useEffect } from 'react'
import * as tagsApi from '../../api/tags'

const TagManager = ({ bookmarkId, initialTags = [], onTagsUpdate }) => {
  const [allTags, setAllTags] = useState([])
  const [bookmarkTags, setBookmarkTags] = useState(initialTags)
  const [newTagName, setNewTagName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 加载所有标签
  useEffect(() => {
    loadAllTags()
  }, [])

  // 加载书签的标签
  useEffect(() => {
    if (bookmarkId) {
      loadBookmarkTags()
    }
  }, [bookmarkId])

  const loadAllTags = async () => {
    try {
      const tags = await tagsApi.getAllTags()
      setAllTags(tags)
    } catch (err) {
      console.error('Failed to load tags:', err)
    }
  }

  const loadBookmarkTags = async () => {
    try {
      const tags = await tagsApi.getBookmarkTags(bookmarkId)
      setBookmarkTags(tags)
    } catch (err) {
      console.error('Failed to load bookmark tags:', err)
    }
  }

  const handleCreateTag = async (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const newTag = await tagsApi.createTag(newTagName.trim())
      setAllTags([...allTags, newTag])
      setNewTagName('')
      setIsCreating(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = async (tag) => {
    if (!bookmarkId) return

    setIsLoading(true)
    setError('')

    try {
      await tagsApi.addTagToBookmark(bookmarkId, tag.id)
      const updatedTags = [...bookmarkTags, tag]
      setBookmarkTags(updatedTags)
      if (onTagsUpdate) {
        onTagsUpdate(updatedTags)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveTag = async (tagId) => {
    if (!bookmarkId) return

    setIsLoading(true)
    setError('')

    try {
      await tagsApi.removeTagFromBookmark(bookmarkId, tagId)
      const updatedTags = bookmarkTags.filter(t => t.id !== tagId)
      setBookmarkTags(updatedTags)
      if (onTagsUpdate) {
        onTagsUpdate(updatedTags)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm('确定要删除这个标签吗？这将从所有书签中移除该标签。')) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await tagsApi.deleteTag(tagId)
      setAllTags(allTags.filter(t => t.id !== tagId))
      setBookmarkTags(bookmarkTags.filter(t => t.id !== tagId))
      if (onTagsUpdate) {
        onTagsUpdate(bookmarkTags.filter(t => t.id !== tagId))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const bookmarkTagIds = bookmarkTags.map(t => t.id)
  const availableTags = allTags.filter(t => !bookmarkTagIds.includes(t.id))

  return (
    <div className="space-y-4">
      {/* 当前书签的标签 */}
      {bookmarkId && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">🏷️ 当前标签</h4>
          <div className="flex flex-wrap gap-2">
            {bookmarkTags.length === 0 ? (
              <span className="text-xs text-gray-500">暂无标签</span>
            ) : (
              bookmarkTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                >
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                    disabled={isLoading}
                    title="移除标签"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* 添加已有标签 */}
      {bookmarkId && availableTags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">➕ 添加标签</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition"
                disabled={isLoading}
              >
                + {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 创建新标签 */}
      <div>
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ✨ 创建新标签
          </button>
        ) : (
          <form onSubmit={handleCreateTag} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="标签名称"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isLoading || !newTagName.trim()}
              >
                创建
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setNewTagName('')
                  setError('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                取消
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 所有标签管理 */}
      {!bookmarkId && allTags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">📚 所有标签</h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300"
              >
                {tag.name}
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="ml-1 text-red-500 hover:text-red-700 font-bold"
                  disabled={isLoading}
                  title="删除标签"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  )
}

export default TagManager

