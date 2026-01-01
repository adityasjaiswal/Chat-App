# Chat-App

# Chit Chat – Real-Time Messaging Platform

A full-stack real-time chat application built using **Node.js, Express, MongoDB, and React** with JWT authentication, privacy-aware blocking system, and production-grade backend architecture.

---

## 🚀 Features

- 🔐 JWT-based authentication  
- 👤 User registration & login  
- 💬 One-to-one real-time messaging  
- ⛔ Block / Unblock users  
- 🛡 Middleware-driven access control  
- 📄 Input validation & custom API errors  
- 📦 Modular MVC-inspired backend architecture  
- ⚡ Async error handling with centralized middleware  
- 🔎 Privacy-aware MongoDB queries  
- 🛡 Blocked users cannot send or receive messages  
- 📜 Chat history with privacy protection  
- ⚡ Secure and validated API endpoints  

---

## 🧪 Tech Stack

- Frontend -> React
- Backend -> Node.js, Express
- Database -> MongoDB
- Auth -> JWT
- Third party services -> Cloudinary (for storing images)
---

## ▶️ Run the Project Locally

### Step 1 – Clone the repository

```bash
git clone https://github.com/adityasjaiswal/Chat-App
cd ChatApp
```



### Step 2 - Install Backend Dependencies


### Step 3 - Install Frontend Dependencies


### Step 4 -  ⚙️ Environment Setup

Create a `.env` file inside the `backend/` directory and add:

```bash
PORT=300
MONGO_DB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
REFRESH_TOKEN_SECRET=your_REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY=your_REFRESH_TOKEN_EXPIRY
ACCESS_TOKEN_SECRET=your_ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY=your_ACCESS_TOKEN_EXPIRY
CLOUDINARY_CLOUD_NAME=your_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=your_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=your_CLOUDINARY_API_SECRET
CLOUDINARY_URL=your_CLOUDINARY_URL
```