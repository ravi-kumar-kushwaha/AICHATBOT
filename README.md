# Chat AI

A full-stack Chat AI web application built with Next.js (frontend), Node.js & Express (backend), Prisma ORM, and PostgreSQL for database management. The project supports user authentication (login/signup), JWT-based authorization, and real-time chatting with a future-ready AI assistant.

## 🔧 Tech Stack

### Frontend:
- **Next.js** (React-based)
- **Tailwind CSS** for styling
- **Axios** for API requests

### Backend:
- **Node.js** with **Express.js**
- **JWT** for authentication and authorization
- **Prisma ORM**
- **PostgreSQL** as the database
- **dotenv** for environment configuration

## 📁 Project Structure

chat_ai/
│
├── frontend/ # Next.js app
│ ├── pages/
│ │ ├── index.js
│ │ ├── login.js
│ │ └── signup.js
│ ├── components/
│ └── utils/
│
├── server/ # Node.js/Express backend
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ └── index.js
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── client.js
│ └── .env
│
├── package.json
├── README.md
└── .env

markdown
Copy
Edit

---

## ✅ Features

### 🔐 Authentication
- User Registration (`/signup`)
- User Login (`/login`)
- Password encryption using `bcryptjs`
- JWT-based session management

### 👥 Authorization
- Role-based access (admin/user)
- Middleware for protected routes

### 🗃️ Database
- PostgreSQL managed via **Prisma ORM**
- User schema with:
  - `id`
  - `name`
  - `email`
  - `password`
  - `role`
  - `createdAt`

### 📡 API Endpoints

| Method | Route            | Description           | Access     |
|--------|------------------|-----------------------|------------|
| POST   | `/api/signup`    | Register a new user   | Public     |
| POST   | `/api/login`     | Login user            | Public     |
| GET    | `/api/me`        | Get logged-in user    | Private    |
| GET    | `/api/users`     | Get all users         | Admin only |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat_ai.git
cd chat_ai
2. Install Dependencies
bash
Copy
Edit
npm install
cd frontend && npm install
cd ../server && npm install
3. Set Up Environment Variables
Create a .env file in the server/ directory:

env
Copy
Edit
DATABASE_URL="postgresql://username:password@localhost:5432/chat_ai"
JWT_SECRET="your_jwt_secret"
PORT=5000
4. Setup Prisma & Database
bash
Copy
Edit
cd server
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
