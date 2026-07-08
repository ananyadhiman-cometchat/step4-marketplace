'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { AuthUser, Role } from '@/types'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  cometchatToken: string | null
  isAuthenticated: boolean
  hasRole: (...roles: Role[]) => boolean
  signIn: (token: string, cometchatToken: string, user: AuthUser) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [cometchatToken, setCometchatToken] = useState<string | null>(null)
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('mkt_token')
      const storedUser = localStorage.getItem('mkt_user')
      const storedCcToken = localStorage.getItem('mkt_cc_token')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as AuthUser)
        setCometchatToken(storedCcToken)
      }
    } catch {
      // corrupted storage — clear it
      localStorage.removeItem('mkt_token')
      localStorage.removeItem('mkt_user')
      localStorage.removeItem('mkt_cc_token')
    } finally {
      setInitialised(true)
    }
  }, [])

  const signIn = (token: string, cometchatToken: string, user: AuthUser) => {
    localStorage.setItem('mkt_token', token)
    localStorage.setItem('mkt_user', JSON.stringify(user))
    localStorage.setItem('mkt_cc_token', cometchatToken)
    setToken(token)
    setUser(user)
    setCometchatToken(cometchatToken)
  }

  const signOut = () => {
    localStorage.removeItem('mkt_token')
    localStorage.removeItem('mkt_user')
    localStorage.removeItem('mkt_cc_token')
    setToken(null)
    setUser(null)
    setCometchatToken(null)
  }

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role)

  if (!initialised) return null

  return (
    <AuthContext.Provider
      value={{ user, token, cometchatToken, isAuthenticated: !!token, hasRole, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
