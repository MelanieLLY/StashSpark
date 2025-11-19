import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getAllBookmarks,
  createBookmark,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  generateSummary,
  getReviewToday,
  getReviewByDateRange,
  markAsReviewed
} from '../controllers/bookmarkController.js'

const router = express.Router()

// All bookmark routes require authentication
router.use(requireAuth)

// Basic CRUD
router.get('/', getAllBookmarks)
router.post('/', createBookmark)
router.get('/:id', getBookmarkById)
router.put('/:id', updateBookmark)
router.delete('/:id', deleteBookmark)

// AI Summary
router.post('/:id/summary', generateSummary)

// Revisit functionality
router.get('/review/today', getReviewToday)
router.get('/review/range', getReviewByDateRange)
router.post('/:id/mark-reviewed', markAsReviewed)

export default router

