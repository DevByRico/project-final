# Barber Booking – Final Project

A full-stack barber appointment app with real-time slot availability, email confirmations (ICS calendar invite), and a protected admin dashboard.

**Live site:** https://barber-rico.netlify.app  
**API (Render):** https://project-final-it0v.onrender.com

---

## ✨ Features
- Fast client (Vite + React + Tailwind)
- Dark/Light theme toggle (persistent)
- Calendar with available time slots (30-min steps)
- Booking flow with confirmation screen
- Email confirmation with .ics calendar attachment
- Admin dashboard (JWT protected): list, toggle status, delete bookings
- Basic rate limiting, Helmet, and CORS
- SEO & PWA essentials (favicons, manifest, social meta)

---

## 🧱 Tech Stack

**Frontend**
- React, React Router  
- Tailwind CSS  
- Vite

**Backend**
- Node.js, Express  
- MongoDB (Mongoose)  
- Nodemailer (Mailtrap in dev)  
- JWT auth

**Hosting**
- Frontend: Netlify  
- Backend: Render

---

## 📁 Project Structure

```bash
project-final/
├─ client/                 # React app (Vite)
│  ├─ public/              # favicons, manifest, apple-touch-icon, logo.png
│  ├─ src/
│  │  ├─ components/       # Header, ThemeToggle, ProtectedRoute, ...
│  │  ├─ pages/            # SelectTime, DetailsPage, ConfirmPage, Admin*
│  │  ├─ brand.js, lib.js, main.jsx, App.jsx, index.css, ...
│  └─ index.html
└─ server/                 # Express API
   ├─ index.js             # API routes, mail, DB
   ├─ package.json
   └─ .env                 # 🔒 private environment variables (not in git)
```

**Booking schema:**
```js
// Unique index prevents double-booking
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
```

---

## 🔒 Security
- Admin JWT stored in **sessionStorage** (clears when closing the tab)
- `helmet`, `cors` (restrict origin), `rate-limit`
- Unique DB index on date+time to stop double-booking
- **Never commit `.env`** — include a `.env.example` with placeholders instead

---

## 🌐 SEO & UX
- Proper `<title>`, meta description, Open Graph, `site.webmanifest`
- `apple-touch-icon.png` (180×180) in `client/public/`
- Keep brand images in `public/` (e.g. `/logo.png`)
- Good contrast in dark mode; semantic HTML

---

## 🛠 Troubleshooting

- **Admin login returns blank / no redirect**  
  Ensure `JWT_SECRET` is set in `server/.env`; restart the server; check `/api/auth/login` in DevTools → Network.

- **CORS errors**  
  `CLIENT_URL` must match the client origin (e.g. `http://localhost:5173`).

- **MongoDB “EBADNAME / <cluster>”**  
  Replace placeholder `<cluster>` with the real cluster host in `MONGODB_URI`.

- **Emails not arriving**  
  Use Mailtrap **Sandbox** in dev; for production use `live.smtp.mailtrap.io:587` with `SMTP_USER=api` and your `SMTP_PASS` (API token). Avoid free Gmail “from” without SPF/DKIM.

- **409 “Time already booked”**  
  Someone took that slot. Choose another.