import { pool } from '../config/database.js'
import { createSession, deleteSession, getSession } from '../config/session.js'

// 简单的密码哈希（开发用，生产环境建议使用 bcrypt）
const hashPassword = (password) => {
  // TODO: 在生产环境中使用 bcrypt
  return Buffer.from(password).toString('base64')
}

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash
}

// 注册
export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }
    
    // 检查用户是否已存在
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' })
    }
    
    // 创建新用户
    const passwordHash = hashPassword(password)
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    )
    
    const user = result.rows[0]
    
    // 创建 session
    const sessionId = createSession(user.id)
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 天
    })
    
    res.status(201).json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ error: '注册失败' })
  }
}

// 登录
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }
    
    // 查找用户
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    )
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    
    const user = result.rows[0]
    
    // 验证密码
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    
    // 创建 session
    const sessionId = createSession(user.id)
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 天
    })
    
    res.json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '登录失败' })
  }
}

// 登出
export const logout = (req, res) => {
  const sessionId = req.headers.cookie
    ?.split('; ')
    .find(row => row.startsWith('sessionId='))
    ?.split('=')[1]
  
  if (sessionId) {
    deleteSession(sessionId)
  }
  
  res.clearCookie('sessionId')
  res.json({ message: '已登出' })
}

// 获取当前用户
export const getCurrentUser = async (req, res) => {
  try {
    const sessionId = req.headers.cookie
      ?.split('; ')
      .find(row => row.startsWith('sessionId='))
      ?.split('=')[1]
    
    if (!sessionId) {
      return res.status(401).json({ error: '未登录' })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: '会话已过期' })
    }
    
    const result = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [session.userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({ error: '获取用户信息失败' })
  }
}

