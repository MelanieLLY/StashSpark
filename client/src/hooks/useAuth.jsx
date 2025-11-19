import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查用户是否已登录
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async (email, password) => {
    const userData = await authApi.login(email, password)
    setUser(userData)
    return userData
  }

  const registerUser = async (email, password) => {
    const userData = await authApi.register(email, password)
    setUser(userData)
    return userData
  }

  const logoutUser = async () => {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return context
}

