# ✝ TEN9 Ministries India — Full Stack Website

A complete full-stack ministry website built with **React**, **Node.js + Express**, and **MongoDB**.

---

## 📁 Project Structure

```
ten9-ministries/
├── client/          ← React frontend
│   ├── src/
│   │   ├── components/    (Navbar, Footer, PageHero)
│   │   ├── pages/         (All 9 public pages + auth + dashboards)
│   │   ├── context/       (AuthContext)
│   │   └── utils/         (API utility)
│   └── package.json
└── server/          ← Node.js + Express backend
    ├── models/      (Owner, Helper, PageContent, Contact)
    ├── routes/      (auth, owner, pages, helpers, contact)
    ├── middleware/  (JWT auth)
    ├── config/      (mailer - SMTP)
    ├── index.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for SMTP email)

---

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ten9ministries
JWT_SECRET=your_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
OWNER_EMAIL=owner@ten9ministries.in
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

Start the server:
```bash
npm run dev   # development with nodemon
# OR
npm start     # production
```

Server runs on **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend runs on **http://localhost:3000**

The `"proxy": "http://localhost:5000"` in `client/package.json` proxies API calls automatically.

---

### 3. Build for Production

```bash
cd client
npm run build
```

Then serve the `build/` folder via Express or a static host (Netlify, Vercel, etc.)

---

## 👥 User Roles

### 👑 Owner
- Register/Login at `/auth/owner/signup` or `/auth/owner/login`
- Full dashboard at `/dashboard/owner`
- Can **edit all 9 ministry pages** (title, subtitle, content)
- Can **view all registered helpers** (name, email, country, city, contact)
- Can **read contact form messages** and mark them as read

### 🤝 Helper
- Register/Login at `/auth/helper/signup` or `/auth/helper/login`
- Full dashboard at `/dashboard/helper`
- Can **view all ministry page content**
- Can view their own profile
- **Welcome email** sent automatically on registration via SMTP

---

## 📧 SMTP Welcome Email

When a helper signs up, they receive an automatic welcome email:

**Subject:** Welcome to the Ten9 India Family 🎉

The email is sent from your configured `SMTP_USER` to the helper's email. Make sure SMTP credentials are set in `.env`.

---

## 🗄️ MongoDB Collections

| Collection   | Fields |
|---|---|
| `owners`     | name, email, password (hashed), role |
| `helpers`    | name, country, city, email, contact, password (hashed), role |
| `pagecontents` | page, title, subtitle, content (mixed), updatedBy |
| `contacts`   | fullName, email, subject, message, read |

---

## 🌐 Public Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/what-we-do` | What We Do |
| `/building-projects` | Building Projects |
| `/christmas-2026` | Project Christmas 2026 |
| `/child-care` | Child Care |
| `/get-involved` | Get Involved |
| `/give` | Your Give |
| `/contact` | Contact Us |

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/owner/signup`
- `POST /api/auth/owner/login`
- `POST /api/auth/helper/signup` — also sends welcome email
- `POST /api/auth/helper/login`

### Pages (public read, owner write)
- `GET /api/pages/:page` — public
- `PUT /api/pages/:page` — owner only

### Owner
- `GET /api/owner/helpers` — owner only

### Contact
- `POST /api/contact` — public
- `GET /api/contact` — owner only
- `PUT /api/contact/:id/read` — owner only

---

## 📌 Notes

- All passwords are hashed with **bcryptjs** (12 salt rounds)
- JWTs expire in **7 days**
- Page content defaults are built-in — no seed needed
- Images use Unsplash URLs (no uploads required for demo)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Axios, react-toastify |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (SMTP) |
| Styling | Custom CSS with CSS variables |
| Fonts | Playfair Display + Crimson Pro (Google Fonts) |

---

Made with ✝ love for TEN9 Ministries India
