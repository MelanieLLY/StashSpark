import { useState, useEffect } from 'react'
import * as tagsApi from '../../api/tags'

const TagFilter = ({ onFilterChange, selectedTags = [] }) => {
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const tags = await tagsApi.getAllTags()
      setAllTags(tags)
    } catch (err) {
      console.error('Failed to load tags:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    onFilterChange(newSelectedTags)
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  if (loading) {
    return (
      <div className="mb-6">
        <div className="text-sm text-gray-500">Loading tags...</div>
      </div>
    )
  }

  if (allTags.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">🏷️ Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Clear filters ({selectedTags.length})
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'bg-white/60 backdrop-blur-sm text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                }
              `}
            >
              {isSelected && '✓ '}
              {tag.name}
            </button>
          )
        })}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-3 text-xs text-gray-600">
          Showing bookmarks with {selectedTags.length === 1 ? 'tag' : 'any of these tags'}
        </div>
      )}
    </div>
  )
}

export default TagFilter

