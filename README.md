# CNG Bharat Admin Panel

Separate admin website for managing fuel stations.

## Quick Start

```bash
npm install
npm run dev
```

Visit: http://localhost:3001

## Admin Login
Create an admin with the backend `create-admin` script and store the password in a secret manager or local `.env` file.

## Features
- 🔐 JWT Authentication
- 📍 Station Management (CRUD)
- 🗺️ Google Geocoding Integration
- 💳 Subscription Plans (Free, Basic, Premium)
- 🔍 Search & Pagination
- 📱 Responsive Design

## Tech Stack
- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios

## Backend API
Connects to backend at `http://localhost:3000/api`

Make sure the backend server is running before starting this admin panel.
