import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib.js'

const BRAND = import.meta.env.VITE_BRAND_NAME || 'Bästa barbern'
const LOGO  = import.meta.env.VITE_LOGO_URL || '/logo.png' // public

function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0) }
function fmtISO(d){ const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), da=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${da}` }

function MonthGrid({ monthDate, selectedDate, onPick }) {
  const first = startOfMonth(monthDate)
  const last = endOfMonth(monthDate)
  const startIdx = (first.getDay()+6)%7
  const days = []
  for (let i=0;i<startIdx;i++) days.push(null)
  for (let d=1; d<=last.getDate(); d++) days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d))

  const labels = ['Må','Ti','On','To','Fr','Lö','Sö']

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
      {labels.map(lbl => <div key={lbl} className="text-[11px] sm:text-xs text-gray-600 dark:text-slate-400">{lbl}</div>)}
      {days.map((d,idx)=>{
        if(!d) return <div key={idx}/>
        const iso = fmtISO(d)
        const selected = selectedDate && fmtISO(selectedDate)===iso
        const past = d < new Date(new Date().toDateString())
        return (
          <button
            key={iso}
            disabled={past}
            onClick={()=>onPick(d)}
            className={[
              "aspect-square rounded-lg border text-sm sm:text-base",
              "border-gray-200 dark:border-slate-700",
              past
                ? "bg-gray-100 dark:bg-slate-900 text-gray-400 cursor-not-allowed"
                : selected
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700"
            ].join(" ")}
            aria-label={iso}
          >
            {d.getDate()}
          </button>
        )
      })}
    </div>
  )
}

export default function SelectTime(){
  const navigate = useNavigate()
  const [month, setMonth] = useState(()=>{ const n=new Date(); n.setHours(0,0,0,0); return n })
  const [pickedDate, setPickedDate] = useState(()=>{ const n=new Date(); n.setHours(0,0,0,0); return n })
  const [slots, setSlots] = useState([])
  const [booked, setBooked] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    const iso = fmtISO(pickedDate)
    setLoading(true); setError('')
    api(`/api/slots?date=${iso}`)
      .then(d => { setSlots(d.available); setBooked(new Set(d.booked)) })
      .catch(e => setError(e.message))
      .finally(()=>setLoading(false))
  }, [pickedDate])

  function toPrev(){ const m=new Date(month); m.setMonth(m.getMonth()-1); setMonth(m) }
  function toNext(){ const m=new Date(month); m.setMonth(m.getMonth()+1); setMonth(m) }
  function proceed(time){ navigate('/details', { state: { date: fmtISO(pickedDate), time } }) }

  const monthName = month.toLocaleDateString('sv-SE',{month:'long'})
  const yearStr = month.getFullYear()
  const headerLabel = useMemo(
    ()=> pickedDate.toLocaleDateString('sv-SE',{ weekday:'long', year:'numeric', month:'long', day:'numeric' }),
    [pickedDate]
  )

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <aside className="card space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={LOGO}
            alt={`${BRAND} logo`}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg"
            onError={(e)=>{ e.currentTarget.style.display='none' }}
          />
          <div>
            <div className="text-xs sm:text-sm text-gray-500">BÄSTA</div>
            <h2 className="text-lg sm:text-xl font-semibold">{BRAND}</h2>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-medium mb-1 sm:mb-2">Vald dag</div>
          <div className="capitalize">{headerLabel}</div>
          <p className="mt-2 muted">
            Välj först datum och tid. Du väljer tjänst på nästa sida.
          </p>
        </div>
      </aside>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button onClick={toPrev}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         border border-gray-200 dark:border-slate-700
                         bg-white dark:bg-slate-800">‹</button>

            <div className="leading-tight">
              <div className="font-semibold text-base sm:text-lg capitalize">{monthName}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">{yearStr}</div>
            </div>

            <button onClick={toNext}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         border border-gray-200 dark:border-slate-700
                         bg-white dark:bg-slate-800">›</button>
          </div>

          <div className="text-xs sm:text-sm muted">
            Tidszon:&nbsp;<span className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </div>

        <MonthGrid monthDate={month} selectedDate={pickedDate} onPick={setPickedDate} />

        <h3 className="mt-4 sm:mt-6 mb-2 font-medium">Lediga tider</h3>
        {loading ? <p>Laddar…</p> : error ? <p className="text-red-500">{error}</p> : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {slots.length === 0 && <p className="text-sm muted col-span-full">Inga tider denna dag.</p>}
            {slots.map(t => {
              const unavailable = booked.has(t)
              return (
                <button
                  key={t}
                  disabled={unavailable}
                  onClick={()=>proceed(t)}
                  className={[
                    "py-2 rounded-lg border text-sm sm:text-base",
                    "border-gray-200 dark:border-slate-700",
                    unavailable
                      ? "bg-gray-100 dark:bg-slate-900 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700"
                  ].join(" ")}
                >
                  {t}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
