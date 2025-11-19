const API_BASE_URL = 'http://localhost:3001/api'

// 获取所有书签
export const getAllBookmarks = async (searchQuery = '') => {
  const url = new URL(`${API_BASE_URL}/bookmarks`)
  if (searchQuery) {
    url.searchParams.append('search', searchQuery)
  }
  
  const response = await fetch(url, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('获取书签失败')
  }
  
  return await response.json()
}

// 创建新书签
export const createBookmark = async (bookmarkData) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bookmarkData),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || '创建书签失败')
  }
  
  return await response.json()
}

// 获取单个书签
export const getBookmarkById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('获取书签失败')
  }
  
  return await response.json()
}

// 更新书签
export const updateBookmark = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  })
  
  if (!response.ok) {
    throw new Error('更新书签失败')
  }
  
  return await response.json()
}

// 删除书签
export const deleteBookmark = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('删除书签失败')
  }
  
  return await response.json()
}

// 生成 AI 摘要
export const generateSummary = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${id}/summary`, {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('生成摘要失败')
  }
  
  return await response.json()
}

// 获取今天需要复习的书签
export const getReviewToday = async () => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/review/today`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('获取复习列表失败')
  }
  
  return await response.json()
}

// 标记为已复习
export const markAsReviewed = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${id}/mark-reviewed`, {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('标记失败')
  }
  
  return await response.json()
}

