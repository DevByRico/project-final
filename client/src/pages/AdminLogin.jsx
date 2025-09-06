import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../lib.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Admin – Logga in' }, [])

  async function submit(e){
    e.preventDefault(); setError('')
    try{
      const { token } = await api('/api/auth/login', { method:'POST', body:{ email, password } })
      setAuthToken(token)
      navigate('/admin')
    }catch(e){ setError(e.message) }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Logga in</h1>
      <form onSubmit={submit} className="card max-w-md p-4 space-y-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium">E-post</span>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Lösenord</span>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button className="btn">Logga in</button>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </form>
    </section>
  )
}
