// src/auth.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))

  // Håller i synk om någon annan flik loggar in/ut
  useEffect(() => {
    const onStorage = () => setToken(sessionStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = (t) => {
    sessionStorage.setItem('token', t)
    setToken(t)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    localStorage.removeItem('token') // städa ev. gammalt
    setToken(null)
  }

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
