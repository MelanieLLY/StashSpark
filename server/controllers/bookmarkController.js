import { pool } from '../config/database.js'
import { generateBookmarkSummary } from '../services/aiService.js'

// 提取域名的辅助函数
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (error) {
    return null
  }
}

// 获取所有书签
export const getAllBookmarks = async (req, res) => {
  try {
    const { search } = req.query
    const userId = req.userId
    
    let query = 'SELECT * FROM bookmarks WHERE user_id = $1'
    const params = [userId]
    
    // 如果有搜索关键词，添加搜索条件
    if (search) {
      query += ' AND (title ILIKE $2 OR notes ILIKE $2 OR url ILIKE $2)'
      params.push(`%${search}%`)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to get bookmarks:', error)
    res.status(500).json({ error: 'Failed to get bookmarks' })
  }
}

// 创建新书签
export const createBookmark = async (req, res) => {
  try {
    const { url, title, notes } = req.body
    const userId = req.userId
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    const domain = extractDomain(url)
    
    // 插入新书签
    const result = await pool.query(
      `INSERT INTO bookmarks (user_id, url, title, domain, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, url, title || 'Untitled Bookmark', domain, notes || '']
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create bookmark:', error)
    res.status(500).json({ error: 'Failed to create bookmark' })
  }
}

// 获取单个书签
export const getBookmarkById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    const result = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to get bookmark:', error)
    res.status(500).json({ error: 'Failed to get bookmark' })
  }
}

// 更新书签
export const updateBookmark = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const { title, notes, review_interval_days, next_review_at } = req.body
    
    // 构建动态更新语句
    const updates = []
    const values = []
    let paramCount = 1
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`)
      values.push(title)
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`)
      values.push(notes)
    }
    if (review_interval_days !== undefined) {
      updates.push(`review_interval_days = $${paramCount++}`)
      values.push(review_interval_days)
    }
    if (next_review_at !== undefined) {
      updates.push(`next_review_at = $${paramCount++}`)
      values.push(next_review_at)
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }
    
    values.push(id, userId)
    
    const result = await pool.query(
      `UPDATE bookmarks 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}
       RETURNING *`,
      values
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update bookmark:', error)
    res.status(500).json({ error: 'Failed to update bookmark' })
  }
}

// 删除书签
export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    res.json({ message: 'Bookmark deleted successfully' })
  } catch (error) {
    console.error('Failed to delete bookmark:', error)
    res.status(500).json({ error: 'Failed to delete bookmark' })
  }
}

// 生成 AI 摘要（使用 OpenAI API）
export const generateSummary = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    // 检查书签是否存在
    const checkResult = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    const bookmark = checkResult.rows[0]
    
    // Call AI service to generate summary
    console.log(`🤖 Generating AI summary for bookmark "${bookmark.title}"...`)
    const aiSummary = await generateBookmarkSummary(bookmark)
    console.log(`✅ Summary generation complete!`)
    
    // Update database
    const result = await pool.query(
      'UPDATE bookmarks SET ai_summary = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [aiSummary, id, userId]
    )
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to generate summary:', error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
}

// Get bookmarks that need to be revisited today
export const getReviewToday = async (req, res) => {
  try {
    const userId = req.userId
    
    const result = await pool.query(
      `SELECT * FROM bookmarks 
       WHERE user_id = $1 
       AND next_review_at IS NOT NULL 
       AND next_review_at <= NOW()
       ORDER BY next_review_at ASC`,
      [userId]
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to get revisit list:', error)
    res.status(500).json({ error: 'Failed to get revisit list' })
  }
}

// Get bookmarks to revisit within a date range (for calendar view)
export const getReviewByDateRange = async (req, res) => {
  try {
    const userId = req.userId
    const { startDate, endDate } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate parameters are required' })
    }
    
    const result = await pool.query(
      `SELECT * FROM bookmarks 
       WHERE user_id = $1 
       AND next_review_at IS NOT NULL 
       AND next_review_at >= $2 
       AND next_review_at < $3
       ORDER BY next_review_at ASC`,
      [userId, startDate, endDate]
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to get revisit list by date range:', error)
    res.status(500).json({ error: 'Failed to get revisit list by date range' })
  }
}

// Mark as revisited
export const markAsReviewed = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    // Get current bookmark info
    const bookmarkResult = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    if (bookmarkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    const bookmark = bookmarkResult.rows[0]
    const intervalDays = bookmark.review_interval_days || 1
    
    // Calculate next revisit time
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)
    // Set to start of day (00:00:00) to avoid timezone issues
    nextReviewDate.setHours(0, 0, 0, 0)
    
    // Update revisit info
    const result = await pool.query(
      `UPDATE bookmarks 
       SET last_reviewed_at = NOW(),
           next_review_at = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [nextReviewDate, id, userId]
    )
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to mark as revisited:', error)
    res.status(500).json({ error: 'Failed to mark as revisited' })
  }
}

