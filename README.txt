# Best barber – Booking App

A fast, robust booking app for barbershops. Customers book in **two quick steps** (date/time → details), receive a **confirmation email with an .ics calendar attachment**, and the shop manages bookings via an **admin dashboard** (login, mark done/undo, delete).

## Features

- 📅 Two-step flow (Calendly-style): **Pick date/time → Fill details → Confirm**
- ✉️ Confirmation email with **.ics** calendar invite
- 🔐 **Admin** with JWT login, **Mark done / Undo**, **Delete**
- 🌙 **Dark mode** (class-based) & fully responsive UI (Tailwind)
- 🧱 Overbooking protection: DB **unique index** on `date + time`
- 🛡️ Security: `helmet`, `cors`, `rate-limit`, server-side validation
- ⚡ Performance & SEO: compression, semantic HTML, meta tags, PWA manifest

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS  
**Backend:** Node.js, Express, Mongoose (MongoDB), Nodemailer (Mailtrap)  
**Other:** JWT (admin), .ics generation, optional WhatsApp Cloud API notifications

---

## Directory Structure

```
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

---

## Getting Started (Local)

### 0) Requirements
- Node 18+
- A MongoDB database (e.g. MongoDB Atlas)
- A Mailtrap account (Sandbox inbox for development)

### 1) Install
```bash
git clone <repo-url>
cd project-final

# client
cd client
npm i

# server
cd ../server
npm i
```

### 2) Environment Variables

Create **`server/.env`** (do **not** commit this file):

```env
# ----- MongoDB -----
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/bookingapp?retryWrites=true&w=majority&appName=<ClusterName>
PORT=5000
CLIENT_URL=http://localhost:5173

# ----- Admin -----
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
JWT_SECRET=<a-long-random-secret-min-32-chars>

# ----- Mail (dev: Mailtrap Sandbox) -----
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<mailtrap-sandbox-user>
SMTP_PASS=<mailtrap-sandbox-pass>
FROM_EMAIL="Bästa barbern <noreply@yourdomain.test>"

# ----- Notifications (optional) -----
BARBER_EMAIL=barber@example.com
BARBER_WHATSAPP=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
```

Optional **`client/.env`** (mainly for production):
```env
# In dev the client auto-uses http://localhost:5000
VITE_API_BASE=https://your-api.example.com
VITE_BRAND_NAME=Bästa barbern
VITE_LOGO_URL=/logo.png
```

### 3) Run (two terminals)

**Server:**
```bash
cd server
npm run dev
# -> Server listening on 5000
```

**Client:**
```bash
cd client
npm run dev
# -> http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## API Overview

| Method | Path                             | Description                          | Auth |
|------:|----------------------------------|--------------------------------------|------|
| GET   | `/api/health`                    | Health check                         | -    |
| POST  | `/api/auth/login`                | Admin login (JWT)                    | -    |
| GET   | `/api/auth/me`                   | Verify token                         | ✅   |
| GET   | `/api/slots?date=YYYY-MM-DD`     | Free times & booked slots            | -    |
| POST  | `/api/bookings`                  | Create booking + email + .ics        | -    |
| GET   | `/api/bookings`                  | List bookings                        | ✅   |
| PATCH | `/api/bookings/:id/toggle`       | Mark **done/undo**                   | ✅   |
| DELETE| `/api/bookings/:id`              | Delete booking                       | ✅   |

**Booking schema:**
```js
{
  name, email, phone,
  date,   // 'YYYY-MM-DD'
  time,   // 'HH:mm'
  service,
  status, // 'confirmed' | 'done'
  createdAt
}
// Unique index prevents double-booking
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
```

---

## Production Build

**Separate hosting:**
```bash
# client
cd client
npm run build
# deploy ./dist to static hosting (Netlify, Vercel, S3, etc.)
```

```bash
# server
cd server
node index.js
```

**Single server serving the client build** (if you added static serving in the API):
```bash
cd client && npm run build
cd ../server && node index.js
```

> Windows note: if `NODE_ENV=production` in scripts causes issues, either install `cross-env` or run `node index.js` directly.

---

## Security

- Admin JWT stored in **sessionStorage** (clears when closing the tab)
- `helmet`, `cors` (restrict origin), `rate-limit`
- Unique DB index on `date+time` to stop double-booking
- **Never commit `.env`** — include a `.env.example` with placeholders instead

Recommended **`.gitignore`** (root):
```gitignore
node_modules/
client/dist/
server/dist/
*.log
.env
*.env
client/.env
server/.env
.DS_Store
Thumbs.db
.vscode/
.idea/
```

---

## SEO & UX

- Proper `<title>`, `meta description`, Open Graph, `site.webmanifest`
- `apple-touch-icon.png` (180×180) in `client/public/`
- Keep brand images in `public/` (e.g. `/logo.png`)
- Good contrast in dark mode; semantic HTML

---

## Troubleshooting

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

- **White screen**  
  Check console; the React Error Boundary shows UI-friendly error messages.

---

## Roadmap

- Multi-tenant (multiple salons): add `Salon` model + `salonId` on bookings; per-salon admin & public routes
- Payments (Stripe)
- Reminder emails (cron/queue) X hours before the appointment
- Calendar sync (Google/Outlook)

## License

MIT (or your preferred license).