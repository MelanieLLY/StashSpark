const API_BASE_URL = 'http://localhost:3001/api'

// 注册
export const register = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || '注册失败')
  }
  
  return data
}

// 登录
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || '登录失败')
  }
  
  return data
}

// 登出
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('登出失败')
  }
  
  return await response.json()
}

// 获取当前用户
export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    return null
  }
  
  return await response.json()
}

