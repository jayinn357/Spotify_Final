# 🎵 Spotify Final - SB19 Music Player

A full-stack music player application built with React (Vite) and Express.js, featuring SB19 tracks integration with Spotify API.

## 🚀 Quick Start

### Option 1: Using Startup Scripts (Recommended)

**PowerShell** (Recommended for VS Code):
```powershell
.\start-app.ps1
```

**Command Prompt**:
```cmd
start-app.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend**:
```powershell
cd backend\server
npm run start
```

**Terminal 2 - Frontend**:
```powershell
cd frontend
npm run dev
```

### 🛑 Stop Servers
```powershell
.\stop-app.ps1
```

## 📁 Project Structure

```
Spotify_Final/
├── frontend/              # React + Vite frontend
│   ├── public/           # Static assets (images, audio)
│   ├── resources/js/     # React source code
│   └── vite.config.ts    # Vite configuration
│
└── backend/server/       # Express.js backend
    ├── server.js         # Main server file
    ├── routes/           # API routes
    ├── controllers/      # Business logic
    ├── models/           # Sequelize models
    └── config/           # Configuration files
```

## 🔧 Prerequisites

- **Node.js** v18+ installed
- **MySQL** server running
- Database `spotify_final` created

## 📦 Installation

If you haven't installed dependencies yet:

```powershell
# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps

# Install backend dependencies
cd ..\backend\server
npm install --legacy-peer-deps
```

## 🌐 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/api/health

## 🔑 Environment Configuration

Backend environment variables are in `backend/server/.env`:

```env
# Database
DB_HOST=127.0.0.1
DB_DATABASE=spotify_final
DB_USERNAME=root
DB_PASSWORD=president357

# Server
PORT=8000
FRONTEND_URL=http://localhost:5173

# Spotify API
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

## 🛠️ Available Scripts

### Frontend (`cd frontend`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run types` - Type check with TypeScript

### Backend (`cd backend/server`)
- `npm run start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run seed` - Seed database with sample data

## 📝 Features

- 🎵 Music player with playlist support
- 🔐 User authentication (login/register)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🎯 SB19 member profiles
- 🔀 Random song generator
- 🎧 Audio preview functionality
- 🔍 Spotify track ID finder

## 🐛 Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```powershell
.\stop-app.ps1
```
Then restart the servers.

### Database Connection Errors
1. Ensure MySQL is running
2. Verify database `spotify_final` exists:
   ```sql
   CREATE DATABASE spotify_final;
   ```
3. Check credentials in `backend/server/.env`

### 500 Errors on Images/API
- Ensure backend server is running first
- Check that `frontend/public/` contains the images and audio folders

### Module Not Found Errors
```powershell
cd frontend  # or cd backend\server
npm install --legacy-peer-deps
```

## 📚 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Radix UI** - Accessible components
- **Framer Motion** - Animations

### Backend
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client for Spotify API

## 📄 Documentation

- [Setup Fixes Applied](SETUP_FIXES.md) - Detailed list of fixes made to the system

## 🤝 Contributing

This is a project for educational purposes. Feel free to fork and modify!

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review `SETUP_FIXES.md` for common solutions
3. Ensure all prerequisites are installed

---

**Status**: ✅ System is operational!  
**Last Updated**: October 30, 2025
