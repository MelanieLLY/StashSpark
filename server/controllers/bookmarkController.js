import { pool } from '../config/database.js'

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
    console.error('获取书签失败:', error)
    res.status(500).json({ error: '获取书签失败' })
  }
}

// 创建新书签
export const createBookmark = async (req, res) => {
  try {
    const { url, title, notes } = req.body
    const userId = req.userId
    
    if (!url) {
      return res.status(400).json({ error: 'URL 不能为空' })
    }
    
    const domain = extractDomain(url)
    
    // 插入新书签
    const result = await pool.query(
      `INSERT INTO bookmarks (user_id, url, title, domain, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, url, title || '未命名书签', domain, notes || '']
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('创建书签失败:', error)
    res.status(500).json({ error: '创建书签失败' })
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
      return res.status(404).json({ error: '书签不存在' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('获取书签失败:', error)
    res.status(500).json({ error: '获取书签失败' })
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
      return res.status(400).json({ error: '没有要更新的字段' })
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
      return res.status(404).json({ error: '书签不存在' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('更新书签失败:', error)
    res.status(500).json({ error: '更新书签失败' })
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
      return res.status(404).json({ error: '书签不存在' })
    }
    
    res.json({ message: '书签已删除' })
  } catch (error) {
    console.error('删除书签失败:', error)
    res.status(500).json({ error: '删除书签失败' })
  }
}

// 生成 AI 摘要（目前使用 mock 数据）
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
      return res.status(404).json({ error: '书签不存在' })
    }
    
    // TODO: 接入真实的 AI API
    // 目前使用 mock 摘要
    const mockSummary = `这是一个自动生成的摘要示例。在实际应用中，这里会调用 AI API（如 OpenAI、Claude 等）来分析网页内容并生成真实的摘要。\n\n主要内容：\n- 要点 1\n- 要点 2\n- 要点 3`
    
    const result = await pool.query(
      'UPDATE bookmarks SET ai_summary = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [mockSummary, id, userId]
    )
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('生成摘要失败:', error)
    res.status(500).json({ error: '生成摘要失败' })
  }
}

// 获取今日需要复习的书签
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
    console.error('获取复习列表失败:', error)
    res.status(500).json({ error: '获取复习列表失败' })
  }
}

// 标记已复习
export const markAsReviewed = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    // 获取当前书签信息
    const bookmarkResult = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    if (bookmarkResult.rows.length === 0) {
      return res.status(404).json({ error: '书签不存在' })
    }
    
    const bookmark = bookmarkResult.rows[0]
    const intervalDays = bookmark.review_interval_days || 1
    
    // 计算下次复习时间
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)
    
    // 更新复习信息
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
    console.error('标记复习失败:', error)
    res.status(500).json({ error: '标记复习失败' })
  }
}

