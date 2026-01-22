# 🔐 Hybrid Auth System: Layered Architecture

## 📋 Assignment Overview
**Assignment 3:** Advanced Registration and Login System.
This project implements a production-grade authentication system using a **Hybrid Database Architecture** (PostgreSQL + MongoDB) and a **Service-Oriented Layered Architecture**. It strictly separates concerns between Controllers, Services, and Data Access layers.

---

## 🚀 Features & Architecture
* **Layered Architecture:** Implements `Controller` -> `Service` -> `Database` pattern to ensure low coupling and high cohesion.
* **Hybrid Database:**
    * **PostgreSQL:** Secure storage for credentials (ACID compliance).
    * **MongoDB:** Flexible storage for user profiles (NoSQL).
* **Security:** Passwords hashed via `bcrypt`; preventing SQL injection via parameterized queries.
* **Graceful Error Handling:** Centralized error middleware prevents server crashes.
* **Logging:** Automated request logging middleware.
* **UX:** Persistent login sessions using `localStorage`.

---

## 🛠 Project Structure (Refactored)

The project is organized to follow industry standards (Single Responsibility Principle):

```text
my-app/
├── config/             # DB Connections (Postgres Pool & Mongoose)
├── controllers/        # Request Handlers (Thin Controllers)
│   ├── authController.js    # Handles Register/Login HTTP requests
│   └── profileController.js # Handles Profile Update HTTP requests
├── services/           # Business Logic Layer (The "Brain")
│   ├── authService.js       # Core Auth logic & Cross-DB orchestration
│   └── profileService.js    # Profile management logic
├── middleware/         # Interceptors
│   ├── logger.js            # Request logging
│   ├── errorHandler.js      # Global error catching
│   └── validateAuth.js      # Input validation
├── models/             # Database Schemas
│   └── Profile.js           # Mongoose Schema for MongoDB
├── routes/             # API Endpoints
├── public/             # Frontend (HTML/CSS/JS)
├── .env                # Secrets (Git Ignored)
└── server.js           # Entry point

```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies

```bash
npm install

```

### 2. Database Setup

**PostgreSQL:** Run this SQL command to create the user table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

```

**MongoDB:** Ensure your Atlas cluster or local instance is running.

### 3. Environment Config (.env)

Create a `.env` file in the root:

```env
# PostgreSQL
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/myapp?retryWrites=true&w=majority

# Server
PORT=3000

```

### 4. Run Server

```bash
node server.js

```

---

## 📡 API Documentation

| Method | Endpoint | Description | Responsibilities (Service Layer) |
| --- | --- | --- | --- |
| **POST** | `/api/register` | Register new user | Checks PG for duplicates -> Hashes password -> Saves to PG -> Calls ProfileService to create Mongo doc. |
| **POST** | `/api/login` | Login user | Finds user in PG -> Validates Hash -> Fetches Profile from Mongo -> Merges data. |
| **PUT** | `/api/update-profile` | Update Bio/Avatar | Performs `upsert` operation in MongoDB to update profile details. |

---

## 💡 Key Design Decisions (Defense Notes)

### 1. Service Layer Pattern (Why `services/`?)

Instead of putting all logic in Controllers, I moved business logic to **Services**.

* **Controllers** only handle HTTP input/output.
* **Services** handle complexity (hashing, DB queries, cross-database logic).
* *Benefit:* The code is cleaner, testable, and easier to maintain.

### 2. Hybrid Database Approach

* **PostgreSQL** is used for critical auth data because of its strict schema and reliability.
* **MongoDB** is used for user profiles because its document-based structure allows for flexible fields (bio, avatar, social links) without schema migrations.

### 3. Decoupling Logic

The `AuthService` does not access the MongoDB model directly. Instead, it requests the `ProfileService` to create a profile. This ensures that the Auth module isn't tightly coupled to the implementation details of the Profile module.