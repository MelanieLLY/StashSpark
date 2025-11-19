import BookmarkItem from './BookmarkItem'

const BookmarkList = ({ bookmarks, onUpdate, onDelete, showReviewButton, onMarkReviewed }) => {
  return (
    <div className="space-y-4">
      {bookmarks.map(bookmark => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onUpdate={onUpdate}
          onDelete={onDelete}
          showReviewButton={showReviewButton}
          onMarkReviewed={onMarkReviewed}
        />
      ))}
    </div>
  )
}

export default BookmarkList

