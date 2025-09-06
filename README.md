
# StoreRating - Store Review & Rating Platform

A full-stack web application for rating and reviewing stores with role-based access control.

**Built by Hardik Gayner** – Modern store rating platform with admin management and real-time features.

---

## ✨ Features

- **User Authentication**: Secure JWT-based login/registration
- **Store Rating**: 1–5 star rating system with comments
- **Role-Based Access**: Admin, Owner, and Normal User roles
- **Admin Dashboard**: Real-time statistics and management panel
- **User & Store Management**: Full CRUD operations
- **Responsive Design**: Modern UI built with React + Tailwind CSS

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)** – Modern frontend framework
- **Tailwind CSS** – Utility-first CSS framework
- **Shadcn/ui** – Elegant component library
- **Lucide React** – Icon set for modern UI

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web application framework
- **MySQL** – Relational database
- **JWT** – Authentication tokens
- **bcryptjs** – Password hashing
- **CORS** – Cross-origin resource sharing

---

## 📂 Project Structure

```text
store-rating-app/
├── frontend/                  # React + Vite frontend
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (Auth, etc.)
│   │   ├── pages/             # Pages (Login, Register, Dashboard, etc.)
│   │   └── App.jsx            # Main app file
│   ├── index.html             # HTML entry
│   └── package.json
├── backend/                   # Express.js backend
│   ├── config/                # Database config
│   ├── controllers/           # Route controllers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── server.js              # Main server file
│   └── package.json
└── README.md


````

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL

### Setup Instructions

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start


* Create a `.env` file:

  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=store_rating_app
  JWT_SECRET=supersecretkey
  ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the App**

   * Frontend: [http://localhost:5173](http://localhost:5173)
   * Backend API: [http://localhost:5000](http://localhost:5000)

---

## 👥 Demo Accounts

| Role        | Email                                         | Password  |
| ----------- | --------------------------------------------- | --------- |
| Admin       | [admin@example.com](mailto:admin@example.com) | Admin123! |
| Owner       | [owner@example.com](mailto:owner@example.com) | Owner123! |
| Normal User | [user@example.com](mailto:user@example.com)   | User123!  |

---

## 📡 API Endpoints

### Authentication

* `POST /api/auth/register` – User registration
* `POST /api/auth/login` – User login

### Users (Admin only)

* `GET /api/users` – Get all users

### Stores

* `GET /api/stores` – Get all stores
* `GET /api/stores/:id` – Get store by ID
* `POST /api/stores` – Create new store (owner only)
* `PUT /api/stores/:id` – Update store (owner only)
* `DELETE /api/stores/:id` – Delete store (owner only)

### Ratings

* `GET /api/ratings` – Get all ratings
* `GET /api/stores/:store_id/ratings` – Get ratings for specific store
* `POST /api/ratings` – Create new rating (authenticated)
* `PUT /api/ratings/:id` – Update rating (owner only)
* `DELETE /api/ratings/:id` – Delete rating (owner only)

---

## 📊 Database Schema (MySQL)

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    role ENUM('user','admin','owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table

```sql
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### Ratings Table

```sql
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🛡 Role-Based Access

* **Admin**: Manage all users, stores, and ratings
* **Owner**: Create and manage their own stores, view ratings
* **User**: Browse stores, submit ratings & comments

---

## 🔧 Troubleshooting

1. **Port already in use**

   ```bash
   npx kill-port 5000
   npx kill-port 5173
   ```

2. **Database connection failed**

   * Check `.env` database credentials
   * Ensure MySQL server is running

3. **CORS errors**

   * Make sure backend is running on port `5000`
   * Verify `CORS` middleware is enabled in Express

---

## 📌 Summary

StoreRating is a modern full-stack project with:

✅ React + Tailwind frontend
✅ Express.js + MySQL backend
✅ Secure JWT authentication
✅ Role-based access control
✅ Admin dashboard with real-time insights