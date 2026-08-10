import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signup = useCallback(async (data) => {
    const u = await authService.signup(data)
    setUser(u)
    return u
  }, [])

  const login = useCallback(async (data) => {
    const u = await authService.login(data)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
