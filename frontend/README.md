# Company Portal - Role-Based Authentication System

A full-stack web application demonstrating role-based authentication and authorization using Flask (Python) and React. Users with different roles (Manager, Worker, SDE, CEO) can log in and access role-specific dashboards and activity logs.

![Project Banner](https://img.shields.io/badge/Stack-Full--Stack-blue) ![Flask](https://img.shields.io/badge/Backend-Flask-green) ![React](https://img.shields.io/badge/Frontend-React%2019-61dafb) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Demo Credentials](#-demo-credentials)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **JWT-Based Authentication** - Secure token-based authentication system
- **Role-Based Access Control (RBAC)** - Different dashboards and permissions for each role
- **Protected Routes** - API endpoints secured with authentication middleware
- **Responsive Design** - Mobile-friendly UI with modern gradient backgrounds
- **Persistent Sessions** - Auto-login using localStorage
- **Real-time Data Fetching** - Dynamic log retrieval based on user role
- **Error Handling** - Comprehensive error messages and loading states
- **Cross-Origin Resource Sharing (CORS)** - Enabled for frontend-backend communication

---

## 🛠️ Tech Stack

### Backend
- **Flask 3.0.0** - Python web framework
- **PyJWT 2.8.0** - JSON Web Token implementation
- **Flask-CORS 4.0.0** - Cross-Origin Resource Sharing
- **Gunicorn 21.2.0** - Production WSGI server

### Frontend
- **React 19.2.0** - JavaScript library for building user interfaces
- **Vite 7.2.4** - Next-generation frontend tooling
- **Vanilla CSS** - Custom styling with modern CSS features

### Development Tools
- **ESLint** - JavaScript linting
- **Python dotenv** - Environment variable management

---

## 📁 Project Structure

```
company-portal/
├── backend/
│   ├── app.py                 # Flask application with routes and auth logic
│   ├── requirements.txt       # Python dependencies
│   ├── vercel.json           # Vercel deployment configuration
│   └── .env                  # Environment variables (not in repo)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Application styles
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── .env                  # Frontend environment variables
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── index.html            # HTML template
│
└── README.md                 # Project documentation
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **pip** - Python package installer

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/company-portal.git
cd company-portal
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional)
echo "SECRET_KEY=your-secret-key-here" > .env
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://127.0.0.1:5000" > .env
```

---

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend

# Activate virtual environment if not already active
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Run Flask development server
python app.py
```

The backend will start on **http://127.0.0.1:5000**

### Start the Frontend Development Server

Open a new terminal window:

```bash
cd frontend

# Start Vite development server
npm run dev
```

The frontend will start on **http://localhost:3000**

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Authenticate user and receive JWT token |
| `GET` | `/` | Health check endpoint |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| `GET` | `/logs` | Get logs based on user role | Any authenticated user |
| `GET` | `/logs/manager` | Get manager-specific logs | Manager only |
| `GET` | `/logs/worker` | Get worker-specific logs | Worker only |
| `GET` | `/logs/sde` | Get SDE-specific logs | SDE only |
| `GET` | `/verify` | Verify JWT token validity | Any authenticated user |

### Request/Response Examples

#### Login Request
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@deepalgorithms.com",
    "password": "manager123"
  }'
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "manager@deepalgorithms.com",
    "role": "manager",
    "name": "Deepa Kandala"
  }
}
```

#### Authenticated Request
```bash
curl -X GET http://localhost:5000/logs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🔑 Demo Credentials

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Manager** | manager@deepalgorithms.com | manager123 | Team logs, Reports |
| **Worker** | worker@deepalgorithms.com | worker123 | Task logs |
| **SDE** | sde@deepalgorithms.com | sde123 | Deployment logs, Error logs |
| **CEO** | ceo@deepalgorithms.com | ceo123 | Strategic logs |

---

## 🌍 Environment Variables

### Backend (.env)

```env
# Flask Secret Key (used for JWT signing)
SECRET_KEY=your-super-secret-key-change-in-production

# Optional: Flask environment
FLASK_ENV=development
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://127.0.0.1:5000

# For production:
# VITE_API_URL=https://your-backend-domain.com
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the frontend.

---


## 🎯  Objectives

This project demonstrates:

- Full-stack application architecture
- RESTful API design principles
- JWT authentication implementation
- Role-based access control (RBAC)
- React hooks and state management
- Modern frontend development with Vite
- Cross-origin resource sharing (CORS)
- Environment-based configuration
- Responsive web design
- Error handling and user feedback
