# 💈 Barber Booking – Final Project

A modern full-stack barber appointment app with real-time slot availability, email confirmations (ICS calendar invite), and a protected admin dashboard.  
Built with a focus on clean code, accessibility, and responsive design.

**Live site:** [https://barber-rico.netlify.app](https://barber-rico.netlify.app)  
**API (Render):** [https://project-final-it0v.onrender.com](https://project-final-it0v.onrender.com)

---

## 🆕 Project Update (Refactor Summary)

This version includes a full refactor and code cleanup based on feedback:

- Converted all components to **functional React** with hooks  
- Simplified and reorganized file structure for readability  
- Improved responsive design and dark/light theme consistency  
- Ensured `.env` and `node_modules` are properly ignored in Git  
- Verified all Technigo requirements are met  

---

## ✨ Features

- Fast frontend (Vite + React + Tailwind)
- Dark/Light theme toggle (saved in localStorage)
- Calendar with selectable time slots (30-min increments)
- Smooth booking flow with confirmation screen
- Email confirmation + downloadable `.ics` calendar invite
- Admin dashboard (JWT-protected): list, mark as done, delete bookings
- Security middleware: rate limiting, Helmet, CORS
- SEO & PWA optimized (favicons, manifest, Open Graph tags)

---

## 🧱 Tech Stack

**Frontend**
- React (functional components)
- React Router
- Tailwind CSS  
- Vite  

**Backend**
- Node.js + Express  
- MongoDB (Mongoose)  
- Nodemailer (Mailtrap for dev)  
- JWT authentication  

**Hosting**
- Frontend → **Netlify**  
- Backend → **Render**

---

## 📁 Project Structure

```bash
project-final/
├─ client/                 # React app (Vite)
│  ├─ public/              # Favicon, manifest, logo, SEO assets
│  ├─ src/
│  │  ├─ components/       # Header, ThemeToggle, ProtectedRoute, etc.
│  │  ├─ pages/            # SelectTime, DetailsPage, ConfirmPage, Admin
│  │  ├─ store/            # Contexts (Auth, Booking)
│  │  ├─ App.jsx, main.jsx, index.css, ...
│  └─ index.html
└─ server/                 # Express API
   ├─ index.js             # Routes, email, DB connection
   ├─ package.json
   └─ .env                 # 🔒 private config (not committed)
```

**Booking schema:**
```js
// Unique index prevents double-booking
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
```

---

## 🔒 Security

- Admin JWT stored in **sessionStorage** (auto-clears when tab closes)
- Uses `helmet`, `cors`, and rate limiting  
- MongoDB unique index on date+time  
- `.env` is excluded from Git (with `.env.example` provided)

---

## 🌐 SEO & UX

- Semantic, accessible structure (WCAG friendly)
- `<title>` + meta descriptions and Open Graph tags  
- Light/dark contrast verified  
- Responsive across all breakpoints (320px → 1920px)
- Smooth transitions and animations for better UX

---

## 🛠 Troubleshooting

- **Admin login not working**
  - Ensure `JWT_SECRET` exists in `.env` and restart server.

- **CORS error**
  - Check that `CLIENT_URL` in `.env` matches your frontend URL.

- **Email not received**
  - Use Mailtrap sandbox credentials in dev; check spam folder.

- **Duplicate booking**
  - MongoDB unique index on date+time prevents double-booking (returns 409).

---

## ✅ Status

✔ Functional React Components  
✔ Responsive and accessible UI  
✔ Code cleaned and organized after feedback  
✔ Meets all Technigo project requirements  

---

## 🧩 Author

Built by **DevByRico** 🎨💻  
_Refactored & improved based on Technigo feedback 2025._