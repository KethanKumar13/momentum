import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import {
  identifyUser,
  resetAnalytics,
  capture,
  EVENTS,
} from '../lib/analytics'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService
      .me()
      .then((u) => {
        setUser(u)

        if (u?.id) {
          identifyUser(u.id, {
            email: u.email,
            plan: u.plan,
          })
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signup = useCallback(async (data) => {
    const u = await authService.signup(data)

    setUser(u)

    identifyUser(u.id, {
      email: u.email,
      plan: u.plan,
    })

    capture(EVENTS.SIGNUP, {
      method: 'password',
    })

    return u
  }, [])

  const login = useCallback(async (data) => {
    const u = await authService.login(data)

    setUser(u)

    identifyUser(u.id, {
      email: u.email,
      plan: u.plan,
    })

    capture(EVENTS.LOGIN, {
      method: 'password',
    })

    return u
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()

    capture(EVENTS.LOGOUT)
    resetAnalytics()
    setUser(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    await authService.deleteAccount()

    capture(EVENTS.ACCOUNT_DELETED)
    resetAnalytics()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
