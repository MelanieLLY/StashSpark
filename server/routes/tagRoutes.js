import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getAllTags,
  createTag,
  addTagToBookmark,
  removeTagFromBookmark,
  getBookmarkTags,
  deleteTag
} from '../controllers/tagController.js'

const router = express.Router()

// All tag routes require authentication
router.use(requireAuth)

// 标签 CRUD
router.get('/', getAllTags)
router.post('/', createTag)
router.delete('/:id', deleteTag)

// 书签标签关联
router.get('/bookmark/:id', getBookmarkTags)
router.post('/bookmark/:id', addTagToBookmark)
router.delete('/bookmark/:id/:tagId', removeTagFromBookmark)

export default router

