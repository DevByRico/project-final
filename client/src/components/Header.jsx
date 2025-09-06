import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { getToken, setAuthToken } from '../lib.js'

// Använd public/logo.png som säkert default
const BRAND = import.meta.env.VITE_BRAND_NAME || 'Bästa barbern'
const LOGO  = import.meta.env.VITE_LOGO_URL || '/logo.png' // <— public

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(getToken())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onChange = () => setToken(getToken())
    window.addEventListener('auth:change', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('auth:change', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  function logout() {
    setAuthToken(null)
    setOpen(false)
    if (location.pathname.startsWith('/admin')) {
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur
                       border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* Bilden laddas från public/, ger aldrig vit sida om saknas */}
          <img
            src={LOGO}
            alt={`${BRAND} logo`}
            className="h-8 w-8 object-contain"
            onError={(e)=>{ e.currentTarget.style.display='none' }}
          />
          <span className="font-semibold tracking-tight">{BRAND}</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          {!token ? (
            <Link to="/admin/login" className="text-sm underline">Admin</Link>
          ) : (
            <>
              <Link to="/admin" className="text-sm underline">Adminpanel</Link>
              <button
                onClick={logout}
                className="text-sm px-2 py-1 rounded border
                           border-gray-300 dark:border-slate-600
                           hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Logga ut
              </button>
            </>
          )}
        </nav>

        <button
          className="sm:hidden px-3 py-2 rounded border border-gray-300 dark:border-slate-600"
          aria-label="Meny"
          onClick={() => setOpen(o => !o)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-gray-200 dark:border-slate-700
                        bg-white dark:bg-slate-900">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">
            <ThemeToggle />
            <Link onClick={()=>setOpen(false)} to="/">Boka</Link>
            {!token ? (
              <Link onClick={()=>setOpen(false)} to="/admin/login">Admin</Link>
            ) : (
              <>
                <Link onClick={()=>setOpen(false)} to="/admin">Adminpanel</Link>
                <button onClick={logout} className="text-left">Logga ut</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
