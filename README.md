# Centralized Student Notice Communication System (NotifyCentral) 🎓

A modern, highly optimized MERN-stack web application designed to bridge the communication gap between college administration, class representatives, and students. Say goodbye to scattered WhatsApp drops and ignored physical notice boards!

Built with a premium, minimalist "HelloBonsai-inspired" UI aesthetic, NotifyCentral ensures critical academic updates, exam schedules, and urgent alerts are delivered in **real-time** directly to students.

---

## ✨ Features

* **Real-Time Push Notifications**: Powered by Socket.io, urgent notices instantly trigger high-visibility toast alerts across all active student clients.
* **Role-Based Access Control (RBAC)**: 
  * **Admins & CRs**: Have exclusive permission to launch the rich-text 'Quick Create' portal to publish content.
  * **Students**: Have optimized, read-only feeds grouped cleanly by priority and category.
* **Granular Notice Targeting**: Broadly publish to "All Students" or surgically target specific branches (e.g., Computer Science) and academic years (e.g., Third-Year only).
* **Rich Text Publishing**: Integrated with React-Quill, ensuring notices retain critical formatting, headers, listicles, and clarity. 
* **Categorization Engine**: Sort massive feeds seamlessly between *Urgent, Exams, Academic, General, Event, and Holiday* verticals.

---

## 🛠 Tech Stack

### Frontend (Client-Side)
* **Framework:** React 18 + Vite (Unmatched lightning-fast HMR)
* **Styling:** Tailwind CSS v4 + Shadcn UI (Custom "Tech Teal" Light Theme layout)
* **Routing:** React Router v6
* **State & Forms:** Context API, Axios, Sonner (Toasts)
* **Real-time Engine:** Socket.io-Client

### Backend (Server-Side)
* **Core:** Node.js + Express
* **Database:** MongoDB Atlas + Mongoose ORM
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
* **Real-time Pipeline:** Socket.io
* **Security:** Helmet, CORS, Morgan

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisite Checks
Ensure you have [Node.js](https://nodejs.org/en/) and MongoDB installed locally, or map a MongoDB Atlas account string.

### 2. Configure Environment Variables
Inside the `server/` directory, create a `.env` file mapping your database and security secrets:
```env
PORT=5000

```

Inside the `frontend/` directory, create a `.env` file (if dynamically pointing to a cloud backend, otherwise Vite will securely fallback to localhost by default):
```env
VITE_BACKEND_URL=your url

### 3. Installation
Open two terminal windows.
**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### 4. Database Seeding (Admin Setup)
By default, the backend will auto-inject a standard `Super Admin` user (`admin@college.edu` | `password123`) directly into the MongoDB layer upon database connection if it detects the system is completely empty.

Alternatively, you can manually trigger dummy data creation via:
```bash
cd server
npm run seed
```

---

## ☁️ Deployment Guidelines
- **Backend (Render):** Map root directory to `server`, build command `npm install`, start command `node server.js`. Ensure you set the `CLIENT_URL` env variable in the Render Dashboard strictly to your Vercel URL domain to bypass secure CORS blocks. Add `0.0.0.0/0` to your MongoDB Atlas IP Whitelist.
- **Frontend (Vercel):** Map root directory to `frontend`, leave framework preset to Vite. Inside Vercel Environment variables, map `VITE_BACKEND_URL` to your live Render API URL.

---

## 👨‍💻 Credits

* **Developed By**: krish kumar singh 

*Engineered with 💡 to simplify academic communication.*
