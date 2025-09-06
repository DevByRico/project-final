# Bästa barbern — Booking System

> A full‑stack barber appointment system with a smooth customer flow, self‑service booking, and a simple admin dashboard.

**Live demo**
- Client (Netlify): https://barber-rico.netlify.app  
- API (Render): https://project-final-it0v.onrender.com
- Repo: https://github.com/DevByRico/project-final

---

## ✨ Features

- **Customer flow**
  - Pick date/time in a responsive calendar.
  - Enter details and confirm booking.
  - Instant **email confirmation** with **.ics** calendar invite.
- **Admin**
  - Login with email + password (JWT in `sessionStorage`).
  - List bookings, mark **done/undone**, **delete**, guarded by `ProtectedRoute`.
- **Duplicate-booking protection** — server schema enforces unique `(date, time)`.
- **Dark mode** with a clean Tailwind design.
- **Mobile-first** + accessible controls (labels, roles, focus states).
- **SEO & PWA basics** — titles, meta tags, favicon set, sitemap/robots (optional).

---

## 🛠 Tech Stack

**Frontend**
- React + React Router
- Tailwind CSS
- Vite

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Nodemailer (Mailtrap in dev)
- Helmet, CORS, Rate-limit, JWT

---

## 📁 Project Structure

```
project-final/
├── client/               # Frontend (Vite + React)
│   ├── public/           # static assets, _redirects for SPA
│   └── src/
│       ├── components/   # Header, ThemeToggle, ProtectedRoute
│       ├── pages/        # SelectTime, DetailsPage, ConfirmPage, Admin*
│       ├── brand.js      # Title helper + branding
│       ├── lib.js        # fetch wrapper (api)
│       └── index.css     # Tailwind + theme tokens
└── server/               # Backend (Express)
    ├── index.js          # API server
    └── .env              # server secrets (NOT committed)
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node 18+ (recommended)
- A MongoDB connection string (Atlas works fine)

### 1) Clone & install
```bash
git clone https://github.com/DevByRico/project-final.git
cd project-final

# client
cd client
npm install
cd ..

# server
cd server
npm install
```

### 2) Configure server environment
Create `server/.env` (do **not** commit this file):

```ini
# ----- MongoDB -----
MONGODB_URI=your-mongodb-uri
PORT=5000
CLIENT_URL=http://localhost:5173

# ----- Admin login -----
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
JWT_SECRET=replace-with-a-long-random-string

# ----- Dev email (Mailtrap sandbox) -----
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=xxxxxxxxxxxxxx
SMTP_PASS=xxxxxxxxxxxxxx
FROM_EMAIL="Bokningsappen <noreply@example.com>"

# ----- Optional barber notifications -----
BARBER_EMAIL=barber@example.com
BARBER_WHATSAPP=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
```

### 3) Run locally
**Terminal 1 – API**
```bash
cd server
npm run dev
# -> http://localhost:5000
```

**Terminal 2 – Client**
```bash
cd client
npm run dev
# -> http://localhost:5173
```

The client uses `client/src/lib.js` which sets:
```js
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');
```
So in development it hits `http://localhost:5000` automatically.

---

## ☁️ Deployment

### 1) Backend (Render)
- Create a **Web Service** from `server/`.
- **Build command**: `npm install`
- **Start command**: `node index.js`
- **Environment**: Add all keys from `server/.env` (except `CLIENT_URL` if not needed).
- After deploy, note your **Render URL**, e.g.  
  `https://project-final-xxxx.onrender.com`

### 2) Frontend (Netlify)
- New site → **Import from Git** → repo root.
- **Base directory**: `client`
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `client/dist`
- Add environment variable:
  - **Key**: `VITE_API_BASE`
  - **Value**: your Render URL (e.g. `https://project-final-xxxx.onrender.com`)
- Ensure SPA redirects in `client/public/_redirects`:
  ```text
  /*  /index.html  200
  ```
- Redeploy site.

---

## 🔌 API Reference

All endpoints are relative to `API_BASE` (local: `http://localhost:5000`).

### Health
`GET /api/health` → `{ ok: true }`

### Auth
- `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns: `{ token }` (store in **sessionStorage**)
- `GET /api/auth/me` (Bearer token) → `{ ok: true, email }`

### Slots
- `GET /api/slots?date=YYYY-MM-DD`
  - Returns: `{ date, available: string[], booked: string[] }`

### Bookings
- `POST /api/bookings`
  - Body: `{ name, email, phone, date, time, service }`
  - Creates booking; emails confirmation with `.ics` invite.
- `GET /api/bookings` (admin)
- `PATCH /api/bookings/:id/toggle` (admin) — toggle `confirmed/done`
- `DELETE /api/bookings/:id` (admin)

> Duplicate protection is enforced at the database level via a **unique index**:
> ```js
> bookingSchema.index({ date: 1, time: 1 }, { unique: true });
> ```
> If a slot is already taken, the server responds with **409 Conflict**.

---

## 🔐 Security Notes

- `helmet()` adds sensible HTTP headers.
- `cors()` is restricted to your `CLIENT_URL` (in dev: `http://localhost:5173`).
- Rate limiting: `express-rate-limit` (defaults: 300 req / 15 min).
- JWT auth for admin routes (token lives in `sessionStorage`).
- Never commit `.env` — it’s in `.gitignore`.

---

## ♿ Accessibility & 🧠 SEO

- Semantic HTML, associated labels, roles, keyboard focus.
- Page titles via `brand.js` (`setTitle(...)`).
- Favicons & manifest in `client/public/`.
- Optional `robots.txt` & `sitemap.xml` can be added to `public/`.

---

## 🧩 Troubleshooting

**MongoDB error `EBADNAME`**  
Check `MONGODB_URI` – it must be a valid connection string (Atlas SRV format usually starts with `mongodb+srv://…`).

**401 Unauthorized (admin pages)**  
Make sure you log in with `ADMIN_EMAIL/ADMIN_PASSWORD`. Token is saved in `sessionStorage`. Protected routes call `/api/auth/me` on load.

**409 Conflict on booking**  
The slot is already taken (unique index). Pick another time.

**Emails not arriving**  
Use Mailtrap sandbox creds in dev. For production, add real SMTP credentials.

**Netlify deploy works but API doesn’t**  
Confirm `VITE_API_BASE` on Netlify matches your Render API URL and redeploy.

---

## 📝 License

MIT © 2025 DevByRico