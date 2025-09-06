// ---- Imports ----
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Ladda .env (måste vara före att du läser process.env)
dotenv.config();

// ---- App setup ----
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Bas-middleware
app.use(helmet());
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ---- Debug: verifiera att .env läses ----
app.get("/api/auth/debug", (_req, res) => {
  res.json({
    envEmail: (process.env.ADMIN_EMAIL || "").trim(),
    hasPassword: Boolean((process.env.ADMIN_PASSWORD || "").trim()),
  });
});

// ---- SMTP verify (dev) ----
app.get("/api/dev/verify-smtp", async (_req, res) => {
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = port === 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const ok = await transporter.verify();
    res.json({ ok });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

// ---- DB ----
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.error("MongoDB error", e);
    process.exit(1);
  });

// ---- Models ----
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  date: { type: String, required: true },  // YYYY-MM-DD
  time: { type: String, required: true },  // HH:mm
  service: { type: String, required: true },
  status: { type: String, enum: ["confirmed", "done"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
const Booking = mongoose.model("Booking", bookingSchema);

// ---- Utils ----
function genSlots(start = "10:00", end = "19:00", step = 30) {
  const toMin = (s) => { const [h,m]=s.split(":").map(Number); return h*60+m; };
  const toStr = (t) => String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
  const res = [];
  for (let t = toMin(start); t < toMin(end); t += step) res.push(toStr(t));
  return res;
}
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  try {
    const token = auth.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// ---- Mailer ----
async function sendEmail({ to, subject, text, html, attachments }) {
  let transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = port === 465; // 465 = TLS
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    // Dev-läge utan riktig SMTP
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  const from = process.env.FROM_EMAIL || "no-reply@example.com";
  const info = await transporter.sendMail({ from, to, subject, text, html, attachments });
  console.log("Email queued:", info.messageId || info);
  return info;
}

// ---- ICS helper ----
function makeICS({ date, time, name, service }) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const dt = (dt) => dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@bookingapp`;
  return [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//bookingapp//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,`DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,`DTEND:${dt(end)}`,
    `SUMMARY:Bokning – ${service}`,
    `DESCRIPTION:Bokning för ${name} (${service}) ${date} ${time}`,
    "END:VEVENT","END:VCALENDAR",
  ].join("\r\n");
}

// (valfritt) WhatsApp: inget i dev
async function sendWhatsApp() {}
async function notifyBarber(booking) {
  const { name, email, phone, date, time, service } = booking;
  const subject = `Ny bokning: ${date} ${time}`;
  const text = `Ny bokning
Namn: ${name}
E-post: ${email}
Telefon: ${phone}
Datum: ${date}
Tid: ${time}
Tjänst: ${service}`;
  if (process.env.BARBER_EMAIL) {
    await sendEmail({
      to: process.env.BARBER_EMAIL,
      subject,
      text,
      html: `<pre>${text}</pre>`,
    }).catch((e) => console.error("Barber email error:", e));
  }
}

// ---- Routes ----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Fixad login: trim + lowercase jämförelse + bättre fel
app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "").trim();

  const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "").trim();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ message: "Admin credentials saknas på servern (.env)." });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "8h" }
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: "Fel e-post eller lösenord." });
});

// Verifiera token
app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ ok: true, email: req.user?.email || null });
});

// Lediga tider
app.get("/api/slots", async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
  const slots = genSlots();
  const bookings = await Booking.find({ date });
  const bookedTimes = new Set(bookings.map((b) => b.time));
  const available = slots.filter((s) => !bookedTimes.has(s));
  res.json({ date, available, booked: Array.from(bookedTimes) });
});

// Skapa bokning + skicka e-post (med .ics) + returnera mailOk
app.post("/api/bookings", async (req, res) => {
  const { name, email, phone, date, time, service } = req.body || {};
  if (!name || !email || !phone || !date || !time || !service)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const booking = await Booking.create({ name, email, phone, date, time, service });

    const subject = "Din bokning är bekräftad";
    const text = `Hej ${name}, din bokning är bekräftad ${date} kl ${time} (${service}).`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Din bokning är bekräftad</h2>
        <p>Hej ${name},</p>
        <p>Här kommer bekräftelsen på din bokning:</p>
        <ul>
          <li><strong>Datum:</strong> ${date}</li>
          <li><strong>Tid:</strong> ${time}</li>
          <li><strong>Tjänst:</strong> ${service}</li>
        </ul>
        <p>Vi ses!</p>
        <p style="color:#6b7280;font-size:12px">Detta är ett automatiskt utskick.</p>
      </div>`;
    const ics = makeICS({ date, time, name, service });

    let mailOk = true;
    try {
      await sendEmail({
        to: email,
        subject,
        text,
        html,
        attachments: [
          { filename: "bokning.ics", content: ics, contentType: "text/calendar; method=PUBLISH" },
        ],
      });
      console.log("Email queued to", email);
    } catch (e) {
      mailOk = false;
      console.error("EMAIL ERROR:", e?.message || e);
    }

    // Avisera barberaren (tyst miss)
    notifyBarber(booking).catch(() => {});

    // Skicka tillbaka kvitto + mailOk-flagga
    res.status(201).json({ booking, mailOk });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Time already booked" });
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: lista / toggla / ta bort bokningar
app.get("/api/bookings", authMiddleware, async (_req, res) => {
  const q = await Booking.find().sort({ date: 1, time: 1 });
  res.json(q);
});
app.patch("/api/bookings/:id/toggle", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const b = await Booking.findById(id);
  if (!b) return res.status(404).json({ message: "Not found" });
  b.status = b.status === "done" ? "confirmed" : "done";
  await b.save();
  res.json(b);
});
app.delete("/api/bookings/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  res.json({ ok: true });
});

// ---- Start ----
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
