import { useState, useEffect } from 'react'
import * as bookmarksApi from '../api/bookmarks'
import BookmarkList from '../components/bookmarks/BookmarkList'
import ReviewCalendar from '../components/bookmarks/ReviewCalendar'
import ReviewCalendarCard from '../components/bookmarks/ReviewCalendarCard'

const ReviewTodayPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('today') // 'today' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateBookmarks, setSelectedDateBookmarks] = useState([])

  useEffect(() => {
    if (viewMode === 'today') {
      loadReviewBookmarks()
    }
  }, [viewMode])

  const loadReviewBookmarks = async () => {
    try {
      setLoading(true)
      const data = await bookmarksApi.getReviewToday()
      setBookmarks(data)
    } catch (err) {
      setError('Failed to load revisit list')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsReviewed = async (id) => {
    try {
      await bookmarksApi.markAsReviewed(id)
      // Remove the revisited bookmark from the list
      setBookmarks(bookmarks.filter(b => b.id !== id))
    } catch (err) {
      console.error('Failed to mark as revisited:', err)
    }
  }

  const handleBookmarkUpdated = (updatedBookmark) => {
    setBookmarks(bookmarks.map(b => 
      b.id === updatedBookmark.id ? updatedBookmark : b
    ))
  }

  const handleBookmarkDeleted = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id))
    setSelectedDateBookmarks(selectedDateBookmarks.filter(b => b.id !== id))
  }

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    setLoading(true)
    try {
      // Get start and end time of the day
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      const dayBookmarks = await bookmarksApi.getReviewByDateRange(
        startOfDay.toISOString(),
        endOfDay.toISOString()
      )
      
      setSelectedDateBookmarks(dayBookmarks)
    } catch (err) {
      console.error('Failed to get date bookmarks:', err)
      setError('Failed to get revisit list for this date')
    } finally {
      setLoading(false)
    }
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setSelectedDate(null)
    setSelectedDateBookmarks([])
    setError('')
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Revisit Center</h1>
            <p className="text-gray-600">
              {viewMode === 'today' 
                ? (bookmarks.length > 0 
                    ? `You have ${bookmarks.length} bookmark${bookmarks.length > 1 ? 's' : ''} to revisit today` 
                    : 'No bookmarks to revisit today')
                : 'View revisit calendar, click on a date to see details'
              }
            </p>
          </div>
          
          {/* View mode toggle buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange('today')}
              className={`px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                viewMode === 'today'
                  ? 'bg-warm-blue-600 text-white'
                  : 'glass text-gray-800 hover:bg-white/60'
              }`}
            >
              📋 Today's Revisit
            </button>
            <button
              onClick={() => handleViewModeChange('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                viewMode === 'calendar'
                  ? 'bg-warm-blue-600 text-white'
                  : 'glass text-gray-800 hover:bg-white/60'
              }`}
            >
              📆 Calendar View
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100/70 backdrop-blur-sm text-red-800 p-4 rounded-xl border border-red-200/50">
          {error}
        </div>
      )}

      {viewMode === 'today' ? (
        // Today's revisit list view
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl shadow-md">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-800 text-lg mb-2">Great job!</p>
              <p className="text-gray-700">No bookmarks to revisit today</p>
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
        </>
      ) : (
        // Calendar view
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewCalendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
          
          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="glass rounded-xl shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revisits on {formatDate(selectedDate)}
                </h3>
                
                {loading ? (
                  <div className="text-center py-8 text-gray-700">
                    Loading...
                  </div>
                ) : selectedDateBookmarks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-gray-700">No revisit tasks on this day</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedDateBookmarks.length} bookmark{selectedDateBookmarks.length > 1 ? 's' : ''} total
                    </p>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {selectedDateBookmarks.map(bookmark => (
                        <ReviewCalendarCard
                          key={bookmark.id}
                          bookmark={bookmark}
                          onMarkReviewed={handleMarkAsReviewed}
                          onDelete={handleBookmarkDeleted}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-light rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-gray-700">
                  Click on a date in the calendar
                  <br />
                  to view revisits for that day
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewTodayPage

