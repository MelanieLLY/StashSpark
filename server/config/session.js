// 简单的 session 管理配置
// 这里使用内存存储（开发用），生产环境建议使用 Redis 或数据库

export const sessions = new Map()

export const createSession = (userId) => {
  const sessionId = Math.random().toString(36).substring(2)
  sessions.set(sessionId, { userId, createdAt: Date.now() })
  return sessionId
}

export const getSession = (sessionId) => {
  return sessions.get(sessionId)
}

export const deleteSession = (sessionId) => {
  sessions.delete(sessionId)
}

export const cleanExpiredSessions = () => {
  const now = Date.now()
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 天
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > maxAge) {
      sessions.delete(sessionId)
    }
  }
}

// 每小时清理一次过期 session
setInterval(cleanExpiredSessions, 60 * 60 * 1000)

