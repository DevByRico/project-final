import React, { useEffect, useState } from 'react'
import { api, getToken } from '../lib.js'

export default function AdminDashboard(){
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true); setError('')
    try {
      const token = getToken()
      const data = await api('/api/bookings', { token })
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function toggle(id) {
    try {
      const token = getToken()
      const updated = await api(`/api/bookings/${id}/toggle`, { method:'PATCH', token })
      setItems(prev => prev.map(it => it._id === id ? updated : it))
    } catch (e) {
      alert(`Kunde inte uppdatera: ${e.message}`)
    }
  }

  async function remove(id) {
    if (!confirm('Ta bort denna bokning?')) return
    try {
      const token = getToken()
      await api(`/api/bookings/${id}`, { method:'DELETE', token })
      setItems(prev => prev.filter(it => it._id !== id))
    } catch (e) {
      alert(`Kunde inte ta bort: ${e.message}`)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Adminpanel</h1>
        <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800">
          Uppdatera
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? <p>Laddar…</p> : items.length === 0 ? (
        <p className="muted">Inga bokningar ännu.</p>
      ) : (
        <ul className="space-y-3">
          {items.map(b => (
            <li key={b._id} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{b.date} {b.time} — {b.name}</div>
                  <div className="text-sm muted">{b.service} · {b.email} · {b.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(b._id)}
                    className={[
                      "px-3 py-1.5 rounded-lg text-sm border",
                      b.status === 'done'
                        ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                        : "bg-yellow-100 text-yellow-900 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700"
                    ].join(' ')}
                    title="Markera klar / Ångra"
                  >
                    {b.status === 'done' ? 'Klar' : 'Bekräftad'}
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                    title="Ta bort"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
