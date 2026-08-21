<div align="center">

# 🎓 Smart Batch Management System

### Full-Stack Student Management Platform

A modern web application for managing the academic and administrative data of an ECE batch.

<br />

<img src="https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br /><br />

<strong>Built by Naitik Vadher</strong>

B.Tech — Electronics & Communication Engineering
Malaviya National Institute of Technology, Jaipur

</div>

---

## 📌 Overview

**Smart Batch Management System** is a full-stack web application designed to manage student information for an ECE batch.

The system provides authenticated access to student records along with CRUD operations, dashboard analytics, reports, search functionality, and CSV export.

The application follows a clear separation between the frontend, backend API, and database.

---

## ✨ Features

### 🔐 Authentication

* Admin login
* JWT-based authentication
* Protected frontend routes
* Protected backend API routes
* Bearer token authentication
* Session-based token storage

### 👨‍🎓 Student Management

* Create student records
* View all students
* View individual student details
* Update student records
* Delete student records
* Search students by name
* Search students by roll number

### 📊 Dashboard

* Total number of students
* Average CGPA
* Average attendance
* Students at risk
* Recent student records
* MongoDB-backed data

### 📈 Reports

* Average CGPA
* Average attendance
* Pass percentage
* Students at risk
* CGPA distribution
* Attendance distribution
* Student performance table
* Student search
* CSV report generation

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │                      │
                    │ Login                │
                    │ Dashboard            │
                    │ Students             │
                    │ Reports              │
                    │ Announcements        │
                    │ Settings             │
                    └──────────┬───────────┘
                               │
                            HTTP + JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express Backend   │
                    │                      │
                    │ Authentication       │
                    │ Middleware           │
                    │ Student CRUD         │
                    │ REST APIs            │
                    └──────────┬───────────┘
                               │
                            Mongoose
                               │
                               ▼
                    ┌──────────────────────┐
                    │     MongoDB Atlas    │
                    │                      │
                    │    Student Data      │
                    └──────────────────────┘
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%">

### Frontend

React
TypeScript
React Router
Tailwind CSS

</td>

<td align="center" width="25%">

### Backend

Node.js
Express.js
REST APIs
JWT

</td>

<td align="center" width="25%">

### Database

MongoDB Atlas
Mongoose
MongoDB
ObjectId

</td>

<td align="center" width="25%">

### Development

Git
GitHub
cURL
dotenv

</td>
</tr>
</table>

---

## 🔑 Authentication Flow

```text
User
  │
  │ Login credentials
  ▼
POST /api/auth/login
  │
  ▼
Express Backend
  │
  │ Validate credentials
  ▼
JWT Generated
  │
  ▼
Frontend
  │
  │ Authorization: Bearer <JWT>
  ▼
Protected API
  │
  ▼
MongoDB
```

JWT tokens currently expire after **1 hour**.

Protected API requests use:

```http
Authorization: Bearer <JWT>
```

---

## 👨‍🎓 Student Data Model

The current student model contains:

```text
name
rollNumber
email
phone
cgpa
semester
attendance
status
remarks
```

Example:

```json
{
  "name": "Aryan Sharma",
  "rollNumber": "23ECE001",
  "email": "aryan@example.com",
  "phone": "9876543210",
  "cgpa": 8.71,
  "semester": 6,
  "attendance": 92,
  "status": "Active",
  "remarks": "Good academic performance"
}
```

---

## 🌐 REST API

| Method   | Endpoint            | Description            | Authentication |
| -------- | ------------------- | ---------------------- | -------------- |
| `POST`   | `/api/auth/login`   | Admin login            | No             |
| `GET`    | `/api/dashboard`    | Dashboard access       | Yes            |
| `POST`   | `/api/students`     | Create student         | Yes            |
| `GET`    | `/api/students`     | Get all students       | Yes            |
| `GET`    | `/api/students/:id` | Get individual student | Yes            |
| `PUT`    | `/api/students/:id` | Update student         | Yes            |
| `DELETE` | `/api/students/:id` | Delete student         | Yes            |

---

## 📁 Project Structure

```text
smart-batch-management/
│
├── backend/
│   ├── middleware/
│   │   └── authmiddleware.js
│   │
│   ├── models/
│   │   └── Student.js
│   │
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── login.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── students.tsx
│   │   │   ├── announcements.tsx
│   │   │   ├── reports.tsx
│   │   │   └── settings.tsx
│   │   │
│   │   └── App.tsx
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_USER_ID=your_admin_user_id
ADMIN_PASSWD=your_admin_password
```

### ⚠️ Security

Never commit `.env` to GitHub.

The `.gitignore` files exclude sensitive environment variables and dependencies from the repository.

Do not expose:

* MongoDB credentials
* JWT secret
* Admin password
* Private environment variables

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd smart-batch-management
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

Expected output:

```text
MongoDB connected
Server running on port 5000
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite development URL displayed in the terminal.

---

## 🧪 API Testing with cURL

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"YOUR_USER_ID\",\"passwd\":\"YOUR_PASSWORD\"}"
```

### Get all students

```bash
curl -X GET http://localhost:5000/api/students ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a student

```bash
curl -X POST http://localhost:5000/api/students ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"name\":\"Test Student\",\"rollNumber\":\"23ECE999\",\"cgpa\":8.2,\"semester\":6,\"attendance\":85,\"status\":\"Active\",\"remarks\":\"Test\"}"
```

cURL is used to test the backend independently from the React frontend.

---

## 🛡️ Security

### Currently Implemented

* JWT authentication
* Protected frontend routes
* Protected backend APIs
* Environment variables for sensitive configuration
* Bearer token authentication
* `.env` excluded from Git

### Current Limitations

The application is currently an MVP and is not intended for production deployment yet.

Advanced security features such as password hashing, role-based access control, rate limiting, stronger backend validation, and production hardening are not currently implemented.

---

## 📊 Current Status

<table>
<thead>
<tr>
<th>Component</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr><td>React frontend</td><td>✅</td></tr>
<tr><td>React Router</td><td>✅</td></tr>
<tr><td>Tailwind CSS</td><td>✅</td></tr>
<tr><td>Express backend</td><td>✅</td></tr>
<tr><td>MongoDB Atlas</td><td>✅</td></tr>
<tr><td>Mongoose</td><td>✅</td></tr>
<tr><td>JWT Authentication</td><td>✅</td></tr>
<tr><td>Protected Routes</td><td>✅</td></tr>
<tr><td>Student CRUD APIs</td><td>✅</td></tr>
<tr><td>cURL API Testing</td><td>✅</td></tr>
<tr><td>Dashboard UI</td><td>✅</td></tr>
<tr><td>Reports UI</td><td>✅</td></tr>
<tr><td>Dashboard Database Integration</td><td>🔄</td></tr>
<tr><td>Reports Database Integration</td><td>🔄</td></tr>
<tr><td>Announcements Backend</td><td>🔄</td></tr>
<tr><td>Settings Backend</td><td>🔄</td></tr>
</tbody>
</table>

---

## 🎯 Project Goal

The goal of **Smart Batch Management System** is to provide a centralized platform for managing student information while gaining practical experience in:

* Full-stack web development
* REST API design
* Authentication
* Database management
* Frontend/backend integration
* API testing
* Data analysis and reporting

---

## 👨‍💻 Author

<div align="center">

### Naitik Vadher

**B.Tech — Electronics & Communication Engineering**

**Malaviya National Institute of Technology, Jaipur**

</div>

---

<div align="center">

**Smart Batch Management System**

Built with React • Node.js • Express • MongoDB

</div>
