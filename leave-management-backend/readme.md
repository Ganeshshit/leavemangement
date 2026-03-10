# Leave Management System – Backend

A RESTful API built with **Node.js**, **Express**, and **MongoDB Atlas** for managing employee leave requests.

---

## 📁 Project Structure

```
leave-management-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Profile
│   └── leaveController.js     # Create, View, Approve/Reject leaves
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── roleMiddleware.js      # Role-based access control
│   └── errorMiddleware.js     # Global error handling + validation
├── models/
│   ├── User.js                # User schema (employee/employer)
│   └── Leave.js               # Leave request schema
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   └── leaveRoutes.js         # /api/leaves/*
├── services/
│   └── leaveService.js        # Business logic layer
├── utils/
│   ├── generateToken.js       # JWT token generator
│   └── validators.js          # express-validator rules
├── .env                       # Environment variables (never commit)
├── .gitignore
├── package.json
└── server.js                  # Entry point
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/leave-management-backend.git
cd leave-management-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leave-management
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

> ⚠️ Replace `<username>` and `<password>` with your **MongoDB Atlas** credentials.

### 4. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint              | Access  | Description           |
|--------|-----------------------|---------|-----------------------|
| POST   | /api/auth/register    | Public  | Register a new user   |
| POST   | /api/auth/login       | Public  | Login and get token   |
| GET    | /api/auth/profile     | Private | Get logged-in profile |

### Employee Routes
| Method | Endpoint          | Access   | Description                 |
|--------|-------------------|----------|-----------------------------|
| POST   | /api/leaves       | Employee | Submit a leave request      |
| GET    | /api/leaves/my    | Employee | View own leave requests     |

### Employer Routes
| Method | Endpoint          | Access   | Description                     |
|--------|-------------------|----------|---------------------------------|
| GET    | /api/leaves       | Employer | View all employee leave requests|
| PUT    | /api/leaves/:id   | Employer | Approve or reject a request     |

---

## 📋 Request & Response Examples

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "employee"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Submit Leave Request
```json
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "Sick Leave",
  "startDate": "2024-08-01",
  "endDate": "2024-08-03",
  "reason": "Fever and doctor appointment"
}
```

### Approve / Reject Leave
```json
PUT /api/leaves/:id
Authorization: Bearer <token>
{
  "status": "Approved"
}
```

---

## 🔐 Security Features
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- **JWT** authentication on all protected routes
- **Role-based access control** — employees cannot approve; employers cannot apply
- Sensitive config stored in **environment variables**
- Input validation with **express-validator**

---

## 🏗️ System Architecture

```
Frontend (Vue + Tailwind)
        ↓
Express Routes
        ↓
Middleware (auth + role check)
        ↓
Controllers (request handling)
        ↓
Services (business logic)
        ↓
Mongoose Models
        ↓
MongoDB Atlas
```

---

## ☁️ Deployment

Deploy easily on:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Vercel](https://vercel.com)
- AWS / Azure / GCP

Set the environment variables in your platform's dashboard and deploy from GitHub.