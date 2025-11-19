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
      console.error('生成摘要失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2">🤖 AI 摘要</h4>
      
      {bookmark.ai_summary ? (
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">{bookmark.ai_summary}</p>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="mt-3 text-sm text-purple-600 hover:underline disabled:opacity-50"
          >
            {loading ? '重新生成中...' : '重新生成'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? '生成中...' : '✨ 生成 AI 摘要'}
        </button>
      )}
    </div>
  )
}

export default SummaryBox

