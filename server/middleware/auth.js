import { getSession } from '../config/session.js'

export const requireAuth = (req, res, next) => {
  // 从 cookie 中获取 sessionId
  const sessionId = req.headers.cookie
    ?.split('; ')
    .find(row => row.startsWith('sessionId='))
    ?.split('=')[1]
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  
  const session = getSession(sessionId)
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired, please login again' })
  }
  
  // 将 userId 挂载到 req 对象上
  req.userId = session.userId
  next()
}

