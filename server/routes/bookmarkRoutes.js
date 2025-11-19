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
  markAsReviewed
} from '../controllers/bookmarkController.js'

const router = express.Router()

// 所有书签路由都需要认证
router.use(requireAuth)

// 基础 CRUD
router.get('/', getAllBookmarks)
router.post('/', createBookmark)
router.get('/:id', getBookmarkById)
router.put('/:id', updateBookmark)
router.delete('/:id', deleteBookmark)

// AI 摘要
router.post('/:id/summary', generateSummary)

// 复习功能
router.get('/review/today', getReviewToday)
router.post('/:id/mark-reviewed', markAsReviewed)

export default router

