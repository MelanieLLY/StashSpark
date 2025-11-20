const API_BASE_URL = 'http://localhost:3001/api'

// 获取用户所有标签
export const getAllTags = async () => {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('获取标签失败')
  }
  
  return await response.json()
}

// 创建新标签
export const createTag = async (name) => {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || '创建标签失败')
  }
  
  return await response.json()
}

// 删除标签
export const deleteTag = async (tagId) => {
  const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('删除标签失败')
  }
  
  return await response.json()
}

// 获取书签的所有标签
export const getBookmarkTags = async (bookmarkId) => {
  const response = await fetch(`${API_BASE_URL}/tags/bookmark/${bookmarkId}`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('获取书签标签失败')
  }
  
  return await response.json()
}

// 为书签添加标签
export const addTagToBookmark = async (bookmarkId, tagId) => {
  const response = await fetch(`${API_BASE_URL}/tags/bookmark/${bookmarkId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ tagId }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || '添加标签失败')
  }
  
  return await response.json()
}

// 从书签移除标签
export const removeTagFromBookmark = async (bookmarkId, tagId) => {
  const response = await fetch(`${API_BASE_URL}/tags/bookmark/${bookmarkId}/${tagId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('移除标签失败')
  }
  
  return await response.json()
}

