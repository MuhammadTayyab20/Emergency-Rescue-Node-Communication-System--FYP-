# Emergency Rescue Node Communication System - Final Setup Guide

This file explains how to install backend and frontend dependencies, then run both servers in different terminals.

---
### Admin Credentials:

- Email
``` 
admin@gmail.com
```

- Password
``` 
admin123456
```

---
## 1) Prerequisites

- Node.js (v20 or later recommended)
- npm (v10 or later recommended)
- Python (v3.10 or later)

## 2) Backend Setup (Install Dependencies)

Open a terminal in the project root, then run:

```bash
cd backend

pip install -r requirements.txt
```

Backend dependencies are installed from:

- `backend/requirements.txt`

## 3) Frontend Setup (Install Dependencies)

From the project root folder, run:

```bash
npm install
```

Frontend dependencies are installed from:

- `package.json`

## 4) Run Backend and Frontend in Different Terminals

Use two separate terminals.

### Terminal 1: Backend Server

```bash
cd backend

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend runs on:

- `http://127.0.0.1:8000`

### Terminal 2: Frontend Server

From project root:

```bash
npm run dev
```

Frontend typically runs on:

- `http://localhost:3001`

## 5) Quick Check

- Backend health check: `http://127.0.0.1:8000/health`
- Frontend should open in browser from Vite output URL.
