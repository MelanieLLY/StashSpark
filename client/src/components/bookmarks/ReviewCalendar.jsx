import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import * as bookmarksApi from '../../api/bookmarks'

const ReviewCalendar = ({ onDateSelect, selectedDate }) => {
  const [reviewData, setReviewData] = useState({}) // { '2024-11-20': [{bookmark1}, {bookmark2}] }
  const [loading, setLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    loadMonthReviews(currentMonth)
  }, [currentMonth])

  const loadMonthReviews = async (date) => {
    try {
      setLoading(true)
      
      // 获取当月第一天和最后一天
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
      
      const bookmarks = await bookmarksApi.getReviewByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      )
      
      // 按日期分组 - 使用本地日期而非UTC日期
      const grouped = {}
      bookmarks.forEach(bookmark => {
        const reviewDate = new Date(bookmark.next_review_at)
        // 使用本地日期格式化，避免时区问题
        const year = reviewDate.getFullYear()
        const month = String(reviewDate.getMonth() + 1).padStart(2, '0')
        const day = String(reviewDate.getDate()).padStart(2, '0')
        const dateKey = `${year}-${month}-${day}`
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(bookmark)
      })
      
      setReviewData(grouped)
    } catch (error) {
      console.error('Failed to load monthly revisit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate)
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      // 使用本地日期格式化
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`
      const count = reviewData[dateKey]?.length || 0
      
      if (count > 0) {
        return (
          <div className="flex justify-center items-center mt-1">
            <span className="bg-warm-blue-600 text-white text-xs rounded-full px-2 py-0.5 shadow-sm">
              {count}
            </span>
          </div>
        )
      }
    }
    return null
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // 使用本地日期格式化
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`
      const hasReview = reviewData[dateKey]?.length > 0
      
      // 比较选中日期
      const isSelected = selectedDate && 
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
      
      const classes = []
      if (hasReview) classes.push('has-review')
      if (isSelected) classes.push('selected-date')
      
      return classes.join(' ')
    }
    return null
  }

  return (
    <div className="review-calendar-container">
      <style>{`
        .review-calendar-container .react-calendar {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-family: inherit;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
          height: 80px;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        .react-calendar__tile.has-review {
          background: rgba(168, 212, 236, 0.3);
          backdrop-filter: blur(4px);
        }
        
        .react-calendar__tile.has-review:hover {
          background: rgba(168, 212, 236, 0.5);
        }
        
        .react-calendar__tile.selected-date {
          background: #5ca7d8 !important;
          color: white;
          box-shadow: 0 2px 4px rgba(92, 167, 216, 0.3);
        }
        
        .react-calendar__tile.selected-date span {
          background: white;
          color: #5ca7d8;
        }
        
        .react-calendar__tile--now {
          background: rgba(254, 243, 199, 0.5);
          backdrop-filter: blur(4px);
        }
        
        .react-calendar__tile--now:hover {
          background: rgba(253, 230, 138, 0.6);
        }
        
        .react-calendar__navigation button {
          font-size: 1rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: #ef4444;
        }
      `}</style>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📅 Revisit Calendar
        </h3>
        <p className="text-sm text-gray-700">
          Click on a date with revisit tasks to view details
        </p>
      </div>
      
      {loading && (
        <div className="text-center py-4 text-gray-700">
          Loading...
        </div>
      )}
      
      <Calendar
        onClickDay={onDateSelect}
        onActiveStartDateChange={handleActiveStartDateChange}
        tileContent={tileContent}
        tileClassName={tileClassName}
        locale="en-US"
        value={selectedDate}
      />
    </div>
  )
}

export default ReviewCalendar

