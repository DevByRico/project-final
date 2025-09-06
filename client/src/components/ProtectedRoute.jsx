import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { api, getToken } from '../lib.js'

export default function ProtectedRoute() {
  const [ok, setOk] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setOk(false); return }
    api('/api/auth/me', { token })
      .then(() => setOk(true))
      .catch(() => { setOk(false) })
  }, [])

  if (ok === null) return null
  return ok ? <Outlet /> : <Navigate to="/admin/login" replace />
}
