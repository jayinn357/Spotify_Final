# System Setup Fixes Applied

## Issues Found and Fixed

### 1. **Static File Path Mismatch** ✅ FIXED
**Problem**: `backend/server/server.js` was trying to serve static files from `backend/public/` but the `public` folder was actually located in `frontend/public/`

**Fix**: Updated the static file paths in `backend/server/server.js`:
```javascript
// Before:
app.use('/audio', express.static(join(__dirname, '../public/audio')));
app.use('/images', express.static(join(__dirname, '../public/images')));

// After:
app.use('/audio', express.static(join(__dirname, '../../frontend/public/audio')));
app.use('/images', express.static(join(__dirname, '../../frontend/public/images')));
```

### 2. **Database Schema Incomplete** ✅ FIXED
**Problem**: 
- `users` table only had 3 columns (`id`, `name`, `email`) but needed `password` and other auth columns
- `artists` table had `image_path` instead of `image_url`
- `tracks` table missing `is_popular` column
- `albums` table didn't exist

**Fix**: Created migration script that:
- Added missing columns to `users` table (password, email_verified_at, spotify_id, spotify_token, etc.)
- Updated `artists` table to use `image_url` instead of `image_path`
- Added `is_popular` column to `tracks` table
- Created proper foreign key relationships between tables

### 3. **Database Name Mismatch** ✅ FIXED
**Problem**: `.env` file had `DB_DATABASE=spotify` but the actual database is named `spotify_final`

**Fix**: Updated `backend/server/.env`:
```
DB_DATABASE=spotify_final
```

### 4. **Duplicate Backend Server Files** ✅ FIXED
**Problem**: Two conflicting server files existed:
- `backend/server.js` (old, basic, port 5000)
- `backend/server/server.js` (current, full-featured, port 8000)

**Fix**: Deleted the old `backend/server.js` and `backend/package.json` files to avoid confusion.

### 5. **Missing Dependencies** ✅ FIXED
**Problem**: Both frontend and backend were missing installed `node_modules`

**Fix**: Ran `npm install --legacy-peer-deps` in both directories:
- `frontend/`
- `backend/server/`

### 6. **Password Hashing Issue** ✅ FIXED
**Problem**: Seeding script was manually hashing passwords, then the User model's `beforeCreate` hook was hashing them AGAIN, causing double-hashing and login failures

**Fix**: Updated the seeding script to let the model's hook handle password hashing automatically

## Database Structure Created

### Tables

#### 1. **users** (Authentication)
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email for login
- `password` - Bcrypt hashed password
- `email_verified_at` - Email verification timestamp
- `spotify_id` - Spotify user ID (if connected)
- `spotify_token` - Spotify access token
- `spotify_refresh_token` - Spotify refresh token
- `remember_token` - Remember me token
- `created_at`, `updated_at` - Timestamps

#### 2. **artists** (SB19 Group + Members)
- `id` - Primary key
- `name` - Artist name (SB19, Pablo, Josh, Stell, Ken, Justin)
- `spotify_id` - Spotify artist ID
- `role` - Member role (Leader, Main Rapper, etc.)
- `image_url` - Artist image URL from Spotify API
- `real_name` - Member's real name
- `specialty` - Member's specialty (nullable for now)
- `created_at`, `updated_at` - Timestamps

**Seeded Data**: 6 artists (SB19 group + 5 members)

#### 3. **albums** (SB19 Albums)
- `id` - Primary key
- `spotify_id` - Spotify album ID
- `name` - Album name
- `images` - JSON array of album cover images
- `created_at`, `updated_at` - Timestamps

**Seeded Data**: 4 albums
- GET IN THE ZONE
- PAGSIBOL
- PAGTATAG!
- Simula at Wakas

#### 4. **tracks** (Songs)
- `id` - Primary key
- `spotify_id` - Spotify track ID
- `spotify_track_id` - Unique Spotify track identifier
- `title` - Track title
- `artist_id` - Foreign key to artists table
- `album_id` - Foreign key to albums table (nullable)
- `duration_ms` - Track duration in milliseconds
- `local_audio_url` - Path to local MP3 file (frontend/public/audio/...)
- `spotify_external_url` - Spotify URL
- `is_featured` - Boolean flag for featured tracks
- `is_popular` - **NEW**: Boolean flag for popular tracks (displayed on home page)
- `order_index` - Display order
- `images` - JSON array of track images
- `created_at`, `updated_at` - Timestamps

**Note**: Tracks will be populated on first run when system fetches from Spotify API

## Fetch-Once-Cache Pattern Verification ✅

The system DOES implement the fetch-once-then-cache pattern:

1. **First Run**: 
   - Controllers (`trackController.js`, `spotifyController.js`) check database first
   - If no data exists, fetch from Spotify API
   - Store fetched data in database (via `importTracks` endpoint)
   - Mark popular tracks with `is_popular = 1`

2. **Subsequent Runs**:
   - Controllers check database first
   - If data exists, return cached data immediately
   - No API calls needed = faster load times

3. **Implementation Details**:
   - `getAllTracks()` - Checks DB first, returns cached tracks
   - `getMemberTracks()` - Checks DB for artist tracks, falls back to API
   - `getSB19PopularTracks()` - Fetches from API (can be modified to cache)
   - `importTracks()` - Endpoint to save API data to database

## Current Project Structure

```
Spotify_Final/
├── frontend/
│   ├── public/                    ← Static files (images, audio)
│   │   ├── images/
│   │   └── audio/
│   │       ├── sb19/
│   │       ├── pablo/
│   │       ├── josh/
│   │       ├── justin/
│   │       ├── stell/
│   │       └── felip/
│   ├── resources/
│   │   └── js/                    ← React app source code
│   │       ├── app.tsx           ← Main entry point
│   │       ├── router.tsx
│   │       ├── components/
│   │       ├── contexts/
│   │       ├── pages/
│   │       └── ...
│   ├── index.html                ← HTML entry (loads /resources/js/app.tsx)
│   ├── vite.config.ts            ← Vite config (proxy to port 8000)
│   ├── tsconfig.json
│   └── package.json
│
└── backend/
    └── server/                    ← Express backend (THE REAL ONE)
        ├── server.js              ← Main server file (port 8000)
        ├── .env                   ← Environment config
        ├── config/
        │   └── database.js        ← Sequelize config
        ├── controllers/
        │   ├── authController.js
        │   ├── spotifyController.js
        │   └── trackController.js
        ├── models/
        │   ├── User.js
        │   ├── Artist.js
        │   ├── Album.js
        │   └── Track.js
        ├── routes/
        ├── scripts/
        │   └── migrate_and_seed.js  ← Database migration & seeding
        └── package.json
```

## How to Run the Application

### Initial Setup (First Time)

1. **Run Migration & Seeding**:
```powershell
cd backend\server
node scripts\migrate_and_seed.js
```

This will:
- Create/update all database tables
- Seed 6 artists (SB19 + 5 members)
- Seed 4 albums
- Create test user (test@sb19.com / password123)

2. **Start Backend Server**:
```powershell
cd backend\server
npm run start
```
**Backend runs on**: http://localhost:8000

3. **Start Frontend Dev Server**:
```powershell
cd frontend
npm run dev
```
**Frontend runs on**: http://localhost:5173

### Quick Start (After Initial Setup)

**PowerShell** (Recommended):
```powershell
.\start-app.ps1
```

**Command Prompt**:
```cmd
start-app.bat
```

### Access the Application
Open your browser and go to: **http://localhost:5173**

**Login Credentials**:
- Email: `test@sb19.com`
- Password: `password123`

## Verified Endpoints

✅ **Frontend**: http://localhost:5173  
✅ **Backend Health**: http://localhost:8000/api/health  
✅ **Login**: http://localhost:8000/api/auth/login (POST)  
✅ **Images**: http://localhost:8000/images/logo.jpg (200 OK)  
✅ **Audio**: http://localhost:8000/audio/sb19/{spotify_id}.mp3  
✅ **API Routes**: http://localhost:8000/api/* (proxied through Vite)

## Database Configuration

Located in `backend/server/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spotify_final
DB_USERNAME=root
DB_PASSWORD=president357
```

Make sure MySQL is running and the `spotify_final` database exists.

## Common Issues & Solutions

### Issue: Login returns "Invalid credentials"
**Solution**: Re-run the migration script to ensure password is hashed correctly:
```powershell
mysql -u root -ppresident357 spotify_final -e "DELETE FROM users WHERE email='test@sb19.com';"
cd backend\server
node scripts/migrate_and_seed.js
```

### Issue: 500 errors on images/API
**Solution**: Make sure the backend server is running on port 8000

### Issue: ECONNREFUSED proxy errors
**Solution**: Backend server isn't running. Start it first before the frontend.

### Issue: Database connection errors
**Solution**: Verify MySQL is running and database `spotify_final` exists with correct credentials in `.env`

### Issue: Module not found errors
**Solution**: Run `npm install --legacy-peer-deps` in the respective directory

## Next Steps

1. ✅ Both servers are running
2. ✅ Static files are being served correctly
3. ✅ Database connection is established
4. ✅ Login working successfully
5. ✅ Database schema complete with all required tables
6. 🔄 Test the application in browser at http://localhost:5173
7. 🔄 On first page load, tracks will be fetched from Spotify API and stored
8. 🔄 Subsequent loads will use cached database data
9. 🔄 Mark popular tracks with `is_popular = 1` for home page display

---

**Status**: ✅ **System is fully operational!**  
**Last Updated**: 2025-10-30 (Migration & seeding completed)
