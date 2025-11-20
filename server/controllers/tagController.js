import { pool } from '../config/database.js'

// 获取用户所有标签
export const getAllTags = async (req, res) => {
  try {
    const userId = req.userId
    
    const result = await pool.query(
      'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to get tags:', error)
    res.status(500).json({ error: 'Failed to get tags' })
  }
}

// 创建新标签
export const createTag = async (req, res) => {
  try {
    const { name } = req.body
    const userId = req.userId
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Tag name is required' })
    }
    
    // 检查标签是否已存在
    const existingTag = await pool.query(
      'SELECT * FROM tags WHERE user_id = $1 AND name = $2',
      [userId, name.trim()]
    )
    
    if (existingTag.rows.length > 0) {
      return res.status(409).json({ error: 'Tag already exists' })
    }
    
    const result = await pool.query(
      'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name.trim()]
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create tag:', error)
    res.status(500).json({ error: 'Failed to create tag' })
  }
}

// 为书签添加标签
export const addTagToBookmark = async (req, res) => {
  try {
    const { id: bookmarkId } = req.params
    const { tagId } = req.body
    const userId = req.userId
    
    if (!tagId) {
      return res.status(400).json({ error: 'Tag ID is required' })
    }
    
    // 验证书签是否属于当前用户
    const bookmarkCheck = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [bookmarkId, userId]
    )
    
    if (bookmarkCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    // 验证标签是否属于当前用户
    const tagCheck = await pool.query(
      'SELECT * FROM tags WHERE id = $1 AND user_id = $2',
      [tagId, userId]
    )
    
    if (tagCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' })
    }
    
    // 检查是否已经关联
    const existingRelation = await pool.query(
      'SELECT * FROM bookmark_tags WHERE bookmark_id = $1 AND tag_id = $2',
      [bookmarkId, tagId]
    )
    
    if (existingRelation.rows.length > 0) {
      return res.status(409).json({ error: 'Tag already added to this bookmark' })
    }
    
    // 添加关联
    await pool.query(
      'INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES ($1, $2)',
      [bookmarkId, tagId]
    )
    
    // 获取更新后的书签及其标签
    const result = await getBookmarkWithTags(bookmarkId)
    
    res.json(result)
  } catch (error) {
    console.error('Failed to add tag to bookmark:', error)
    res.status(500).json({ error: 'Failed to add tag to bookmark' })
  }
}

// 从书签移除标签
export const removeTagFromBookmark = async (req, res) => {
  try {
    const { id: bookmarkId, tagId } = req.params
    const userId = req.userId
    
    // 验证书签是否属于当前用户
    const bookmarkCheck = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [bookmarkId, userId]
    )
    
    if (bookmarkCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    // 验证标签是否属于当前用户
    const tagCheck = await pool.query(
      'SELECT * FROM tags WHERE id = $1 AND user_id = $2',
      [tagId, userId]
    )
    
    if (tagCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' })
    }
    
    // 删除关联
    const deleteResult = await pool.query(
      'DELETE FROM bookmark_tags WHERE bookmark_id = $1 AND tag_id = $2 RETURNING *',
      [bookmarkId, tagId]
    )
    
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found on this bookmark' })
    }
    
    // 获取更新后的书签及其标签
    const result = await getBookmarkWithTags(bookmarkId)
    
    res.json(result)
  } catch (error) {
    console.error('Failed to remove tag from bookmark:', error)
    res.status(500).json({ error: 'Failed to remove tag from bookmark' })
  }
}

// 获取书签的所有标签
export const getBookmarkTags = async (req, res) => {
  try {
    const { id: bookmarkId } = req.params
    const userId = req.userId
    
    // 验证书签是否属于当前用户
    const bookmarkCheck = await pool.query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2',
      [bookmarkId, userId]
    )
    
    if (bookmarkCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }
    
    const result = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
       WHERE bt.bookmark_id = $1 AND t.user_id = $2
       ORDER BY t.name ASC`,
      [bookmarkId, userId]
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to get bookmark tags:', error)
    res.status(500).json({ error: 'Failed to get bookmark tags' })
  }
}

// 删除标签（会自动删除所有相关联的 bookmark_tags）
export const deleteTag = async (req, res) => {
  try {
    const { id: tagId } = req.params
    const userId = req.userId
    
    const result = await pool.query(
      'DELETE FROM tags WHERE id = $1 AND user_id = $2 RETURNING *',
      [tagId, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' })
    }
    
    res.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Failed to delete tag:', error)
    res.status(500).json({ error: 'Failed to delete tag' })
  }
}

// 辅助函数：获取书签及其标签
async function getBookmarkWithTags(bookmarkId) {
  const bookmarkResult = await pool.query(
    'SELECT * FROM bookmarks WHERE id = $1',
    [bookmarkId]
  )
  
  const tagsResult = await pool.query(
    `SELECT t.* FROM tags t
     INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
     WHERE bt.bookmark_id = $1
     ORDER BY t.name ASC`,
    [bookmarkId]
  )
  
  return {
    ...bookmarkResult.rows[0],
    tags: tagsResult.rows
  }
}

