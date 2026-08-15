import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import {
  identifyUser,
  resetAnalytics,
  capture,
  EVENTS,
} from '../lib/analytics'

/** Small helper — never throws, always returns a user or null. */
async function safeMe() {
  try {
    return await authService.me()
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const u = await safeMe()
    setUser(u)
    if (u?.id) identifyUser(u.id, { email: u.email, plan: u.plan })
    return u
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const u = await safeMe()

      if (cancelled) return

      setUser(u)

      if (u?.id) {
        identifyUser(u.id, {
          email: u.email,
          plan: u.plan,
        })
      }

      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
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
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
