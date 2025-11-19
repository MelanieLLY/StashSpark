import { useState } from 'react'
import * as bookmarksApi from '../../api/bookmarks'

const SummaryBox = ({ bookmark, onUpdate }) => {
  const [loading, setLoading] = useState(false)

  const handleGenerateSummary = async () => {
    setLoading(true)
    try {
      const updated = await bookmarksApi.generateSummary(bookmark.id)
      onUpdate(updated)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2">🤖 AI Summary</h4>
      
      {bookmark.ai_summary ? (
        <div className="bg-purple-100/50 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
          <p className="text-gray-800 whitespace-pre-wrap">{bookmark.ai_summary}</p>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="mt-3 text-sm text-purple-700 hover:underline disabled:opacity-50 font-medium"
          >
            {loading ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Generating...' : '✨ Generate AI Summary'}
        </button>
      )}
    </div>
  )
}

export default SummaryBox

