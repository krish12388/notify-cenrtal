# Project Report: NotifyCentral

## 1. Abstract
**NotifyCentral** is a comprehensive, centralized communication and classroom management platform designed for educational institutions. The system bridges the communication gap between administrators, teachers, class representatives (CRs), and students. By providing role-based access control, real-time announcements, assignment tracking, and document sharing, NotifyCentral eliminates the fragmentation of college communications. A unique architectural feature of the system is its polyglot persistence model—utilizing a dual-database strategy with **MongoDB** for flexible, unstructured data (like notices and assignments) and **PostgreSQL** for strict, structured relational data (User authentication and profiles).

## 2. Introduction
In many academic institutions, communication is heavily fragmented across various messaging apps, emails, and physical notice boards. Students frequently miss critical deadlines, urgent announcements, or assignment details. **NotifyCentral** was developed to solve this problem by providing a single, unified source of truth. 

The platform supports four distinct user roles:
* **Students:** View notices, join classrooms, and submit assignments.
* **Class Representatives (CRs):** Act as intermediaries who can post notices on behalf of teachers.
* **Teachers:** Manage virtual classrooms, post assignments, grade submissions, and broadcast notices.
* **Admins:** Oversee the entire system, manage users, and moderate content.

By centralizing these functions, NotifyCentral significantly reduces administrative overhead and enhances the educational experience for all stakeholders.

## 3. Methodology
NotifyCentral is built using a modern, scalable web architecture:
* **Frontend:** Built with React.js (via Vite) and TailwindCSS, providing a highly responsive and modern user interface.
* **Backend:** Powered by Node.js and Express.js, utilizing a RESTful API design. Real-time features (like urgent notice pop-ups) are handled via Socket.io.
* **Database Architecture (Polyglot Persistence):**
  * **MongoDB:** Used for highly dynamic records such as Notices, Classrooms, and Assignments, allowing for flexible arrays (e.g., attachments, student lists).
  * **PostgreSQL (via Supabase):** Integrated specifically for the `Users` entity. Using a relational database for users ensures strict data integrity, guarantees unique constraints (like emails), and provides robust, standardized querying for authentication.

When a Classroom or Notice requires user data, the backend queries MongoDB for the document, extracts the User ID, and dynamically fetches the user's details from PostgreSQL.

## 4. Result
The system was successfully developed and deployed to the cloud (Render for backend, Vercel for frontend). Key achievements include:
* **Real-time Synchronization:** Students receive instant updates when a teacher or admin posts an urgent notice.
* **Seamless Role Management:** Teachers can successfully provision classrooms, while students can effortlessly track their pending assignments.
* **Successful Database Migration:** The core user authentication layer was successfully decoupled and migrated to a cloud PostgreSQL instance without disrupting the existing MongoDB ecosystem.

---

## 5. Reference: PostgreSQL Implementation Snippets

To demonstrate the database integration, below are the core PostgreSQL code snippets implemented in the backend.

### 5.1. Database Connection and Table Initialization
*This snippet shows how the application connects to the cloud PostgreSQL database using connection pooling and automatically creates the `users` table on startup.*

```javascript
// server/config/pgdb.js
const { Pool } = require('pg');

const pgUri = process.env.PG_URI;

// Initialize connection pool with SSL enabled for cloud databases
const pool = new Pool({
  connectionString: pgUri,
  ssl: pgUri.includes('localhost') ? false : { rejectUnauthorized: false }
});

const initDB = async () => {
  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(24) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "rollNumber" VARCHAR(255),
        branch VARCHAR(255),
        year INTEGER,
        role VARCHAR(50) DEFAULT 'student',
        "notificationPreferences" JSONB DEFAULT '{"inApp": true, "email": false}'::jsonb,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUsersTableQuery);
    console.log('PostgreSQL: Users table initialized successfully');
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params)
};
```

### 5.2. User Registration (Inserting into PostgreSQL)
*This snippet demonstrates how a new user is securely hashed and inserted into the Postgres database.*

```javascript
// server/controllers/auth.controller.js (Registration logic)
const bcrypt = require('bcryptjs');
const pgdb = require('../config/pgdb');

// Check if user already exists
const { rows } = await pgdb.query('SELECT * FROM users WHERE email = $1', [email]);
if (rows.length > 0) return res.status(400).json({ success: false, message: 'User already exists' });

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Generate a 24-character ID to maintain compatibility with MongoDB ObjectIds
const newId = new mongoose.Types.ObjectId().toHexString(); 

// Insert into PostgreSQL
const insertQuery = `
  INSERT INTO users (id, name, email, password, "rollNumber", branch, year, role) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
`;
const insertValues = [newId, name, email, hashedPassword, rollNumber, branch, year, role];

const { rows: insertedRows } = await pgdb.query(insertQuery, insertValues);
const user = insertedRows[0];
```

### 5.3. Cross-Database Querying (PostgreSQL + MongoDB)
*Because Notices are stored in MongoDB and Users in PostgreSQL, we manually fetch the user details from Postgres to combine the data before sending it to the frontend.*

```javascript
// server/controllers/notice.controller.js
// 1. Fetch Notices from MongoDB
const notices = await Notice.find(query).lean();

// 2. Extract all unique User IDs from the fetched notices
const userIds = [...new Set(notices.map(n => n.postedBy?.toString()))];

if (userIds.length > 0) {
  // 3. Query PostgreSQL for those specific users using the ANY() operator
  const { rows: users } = await pgdb.query(
    'SELECT id, name, role FROM users WHERE id = ANY($1::varchar[])', 
    [userIds]
  );
  
  // 4. Map the Postgres users back to their respective MongoDB notices
  const userMap = {};
  users.forEach(u => userMap[u.id] = { _id: u.id, name: u.name, role: u.role });
  
  notices.forEach(n => {
    n.postedBy = userMap[n.postedBy.toString()] || n.postedBy;
  });
}

res.status(200).json({ success: true, data: notices });
```
