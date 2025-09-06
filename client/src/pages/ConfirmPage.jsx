import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function ConfirmPage(){
  const { state } = useLocation() || {}
  const mailOk = state?.mailOk !== false // default true

  return (
    <section className="card p-4 sm:p-6">
      <h1 className="text-xl font-semibold mb-2">Tack! Din bokning är bekräftad.</h1>

      {mailOk ? (
        <p className="muted">En bekräftelse har skickats till din e-postadress.</p>
      ) : (
        <p className="muted">
          Din bekräftelse kunde inte skickas just nu – men bokningen är registrerad.
          Försök igen senare eller kontakta salongen.
        </p>
      )}

      <Link to="/" className="btn mt-4">Gå till startsidan</Link>
    </section>
  )
}
