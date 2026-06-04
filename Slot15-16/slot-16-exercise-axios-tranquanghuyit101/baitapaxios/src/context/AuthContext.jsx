import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/userApi.js'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('current_user')
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved session', e)
      }
    }
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    setError('')
    try {
      const { account, user } = await authApi.login(username, password)
      const session = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: account.role,
      }
      setCurrentUser(session)
      localStorage.setItem('current_user', JSON.stringify(session))
      return true
    } catch (err) {
      setError(err?.message || 'Đăng nhập không thành công.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('current_user')
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
