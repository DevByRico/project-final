import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib.js'

export default function DetailsPage(){
  const { state } = useLocation() || {}
  const navigate = useNavigate()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [service, setService] = React.useState('Skin fade (300 kr)')
  const [other, setOther] = React.useState('')
  const [error, setError] = React.useState('')

  if(!state?.date || !state?.time){
    return <p className="muted">Ingen tid vald. Gå tillbaka.</p>
  }

  async function submit(e){
    e.preventDefault(); setError('')
    const chosenService = service === 'Övrigt' ? `Övrigt: ${other}` : service

    try{
      const resp = await api('/api/bookings', {
        method:'POST',
        body: { name, email, phone, date: state.date, time: state.time, service: chosenService }
      })

      navigate('/confirm', { state: { ok: true, mailOk: !!resp?.mailOk } })
    }catch(e){
      setError(e.message)
    }
  }

  return (
    <section className="grid grid-cols-1 gap-6">
      <form onSubmit={submit} className="card p-4 sm:p-6 space-y-4">
        <h1 className="text-xl font-semibold">Dina uppgifter</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium">Namn</span>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">E-post</span>
            <input type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="font-medium">Telefon</span>
            <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} required />
          </label>
        </div>

        <div className="space-y-2">
          <span className="font-medium">Välj tjänst</span>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'Skin fade (300 kr)',
              'Skin fade & skägg (400 kr)',
              'Barnklippning (250 kr)',
              'Pensionär (230 kr)',
              'Övrigt'
            ].map(opt => (
              <label key={opt}
                     className="flex items-center gap-2 rounded-lg border
                                border-gray-200 dark:border-slate-700
                                bg-white dark:bg-slate-800 px-3 py-2">
                <input
                  type="radio"
                  name="service"
                  value={opt}
                  checked={service === opt}
                  onChange={() => setService(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {service === 'Övrigt' && (
            <input
              placeholder="Skriv önskemål…"
              className="input mt-2"
              value={other}
              onChange={e=>setOther(e.target.value)}
              required
            />
          )}
        </div>

        <button className="btn">Bekräfta bokning</button>
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </section>
  )
}
