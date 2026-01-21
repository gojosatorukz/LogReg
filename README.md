# 🔐 Hybrid Auth System: Node.js + PostgreSQL + MongoDB

## 📋 Assignment Overview
**Assignment 3:** Creating a Registration and Login System with Mixed Databases.
This project implements a secure, backend-focused authentication system using a **Hybrid Architecture**. It leverages **PostgreSQL** for secure credential storage and **MongoDB** for flexible user profile management, strictly following the MVC pattern.

---

## 🚀 Features & Requirements Met
This solution addresses all core requirements of the assignment:
* **Hybrid Database:** Combines PostgreSQL (Relational) and MongoDB (NoSQL).
* **Security:** Passwords are hashed using `bcrypt` (never stored in plain text).
* **Validation:** Dedicated middleware (`validateAuth`) checks input presence, format, and password length.
* **Graceful Handling:** Uses `upsert` logic to handle profile creation/updates seamlessly.
* **Architecture:** Code is organized into `routes`, `controllers`, `models`, and `middleware`.
* **Frontend:** A responsive, modern HTML/CSS/JS client with persistent login state (`localStorage`).

---

## 🛠 Project Structure
The project follows the **MVC (Model-View-Controller)** pattern:

```text
my-app/
├── config/         # Database connection logic (PG & Mongo)
├── controllers/    # Business logic (Auth & Profile management)
├── middleware/     # Request validation & error handling
├── models/         # Mongoose Schemas (MongoDB)
├── routes/         # API route definitions
├── public/         # Client-side files (HTML, CSS, JS)
├── .env            # Environment variables (Ignored by Git)
└── server.js       # Entry point

```

---

## ⚙️ Installation & Setup

Since `node_modules` and `.env` are excluded from the repository, please follow these steps to run the project locally.

### 1. Clone & Install Dependencies

Download the project and install the required packages:

```bash
npm install

```

### 2. Database Setup (PostgreSQL)

Ensure PostgreSQL is running. Open your SQL tool (pgAdmin or psql) and run this command:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

```

### 3. Environment Configuration

Create a file named `.env` in the root directory. Copy the configuration below (replace with your credentials):

```env
# PostgreSQL Configuration
DB_USER=postgres
DB_PASSWORD=your_pg_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres

# MongoDB Configuration (Local or Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myapp?retryWrites=true&w=majority

# Server Port
PORT=3000

```

### 4. Run the Server

Start the application:

```bash
node server.js

```

> The server will start on **http://localhost:3000**

---

## 📡 API Documentation

### 1. Register User

* **Endpoint:** `POST /api/register`
* **Description:** Creates a user in Postgres and a profile in MongoDB.
* **Body:**
```json
{ "email": "student@example.com", "password": "securePassword123" }

```


* **Responses:**
* `201 Created`: Registration successful.
* `400 Bad Request`: Validation error or email exists.



### 2. Login User

* **Endpoint:** `POST /api/login`
* **Description:** Authenticates user and retrieves profile data.
* **Body:**
```json
{ "email": "student@example.com", "password": "securePassword123" }

```


* **Responses:**
* `200 OK`: Returns User ID (PG) + Bio/Avatar (Mongo).
* `401 Unauthorized`: Incorrect credentials.



### 3. Update Profile

* **Endpoint:** `PUT /api/update-profile`
* **Description:** Updates (or creates) profile data in MongoDB.
* **Body:**
```json
{
  "userId": "1",
  "bio": "New Bio Description",
  "avatarUrl": "[https://example.com/image.png](https://example.com/image.png)"
}

```


* **Responses:**
* `200 OK`: Profile updated successfully.



---

## 💡 Key Design Decisions (Hybrid Architecture)

This project implements a **Hybrid Database Architecture** to maximize efficiency:

1. **PostgreSQL (Relational):**
* Used for **Core Authentication Data** (Email, Password Hash, User ID).
* **Reason:** SQL provides ACID compliance and strict schema structure, which is critical for security and account integrity.


2. **MongoDB (NoSQL):**
* Used for **User Profiles** (Bio, Avatar URL).
* **Reason:** NoSQL allows for a flexible schema, making it ideal for storing unstructured or frequently changing profile data without altering the main database table.


3. **Data Linking:**
* The two databases are linked via the `userId`. The system ensures consistency by creating a MongoDB document linked to the PostgreSQL ID upon registration.
