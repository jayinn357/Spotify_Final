# SB19 Spotify App - Express Backend

This is the Express.js backend that replaces the Laravel PHP backend while maintaining the same API structure.

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Spotify Developer Account (for API credentials)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database - Use your existing MySQL database
DB_DATABASE=spotify
DB_USERNAME=root
DB_PASSWORD=your_password

# Spotify API - Get from https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# Session & JWT Secrets - Change these!
SESSION_SECRET=your-random-secret-key
JWT_SECRET=your-random-jwt-secret
```

### 3. Database Setup

The server will automatically create tables when it starts. To seed test users:

```bash
npm run seed
```

This creates three test users:
- `user@mahalima.com` / `password`
- `test@mahalima.com` / `password`
- `fan@mahalima.com` / `password`

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:8000`

## Frontend Configuration

Update your frontend to connect to the Express backend:

### Update Vite Config (`vite.config.ts`)

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/audio': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/images': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  // ... rest of config
});
```

### Update Inertia Setup

Since we're moving from Laravel+Inertia to Express+React, you'll need to:

1. Remove Inertia.js dependencies (or keep for client-side routing)
2. Use React Router or similar for routing
3. Update API calls to use fetch/axios directly

**Example API call:**

```typescript
// Before (Laravel/Inertia)
router.post('/login', data);

// After (Express)
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify(data)
});
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Spotify Integration
- `GET /api/spotify/search` - Search Spotify
- `GET /api/spotify/artists/:id` - Get artist
- `GET /api/spotify/artists/:id/top-tracks` - Get artist top tracks
- `GET /api/spotify/albums/:id` - Get album
- `GET /api/spotify/albums/:id/tracks` - Get album tracks
- `GET /api/spotify/tracks/:id` - Get track

### Tracks
- `GET /api/tracks/sb19/popular` - Get SB19 popular tracks (authenticated)
- `GET /api/tracks/member/:memberId` - Get member tracks (authenticated)

### Settings
- `GET /api/settings/profile` - Get user profile (authenticated)
- `PATCH /api/settings/profile` - Update profile (authenticated)
- `DELETE /api/settings/profile` - Delete account (authenticated)
- `PUT /api/settings/password` - Update password (authenticated)

## Authentication

The Express backend uses JWT tokens stored in HTTP-only cookies. When making requests from the frontend:

```typescript
// Always include credentials for authentication
fetch('http://localhost:8000/api/tracks/sb19/popular', {
  credentials: 'include'
})
```

## Project Structure

```
server/
├── server.js                 # Main application entry
├── package.json             # Dependencies
├── .env                     # Environment variables
├── config/
│   └── database.js         # Database configuration
├── models/
│   ├── User.js             # User model
│   ├── Track.js            # Track model
│   └── Album.js            # Album model
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── spotifyController.js # Spotify API integration
│   ├── trackController.js  # Track management
│   └── settingsController.js # User settings
├── routes/
│   ├── auth.js             # Auth routes
│   ├── spotify.js          # Spotify routes
│   ├── tracks.js           # Track routes
│   └── settings.js         # Settings routes
├── middleware/
│   └── auth.js             # Authentication middleware
└── database/
    └── seeders/
        └── seed.js         # Database seeder
```

## Migration from Laravel

The Express backend maintains API compatibility with the Laravel version:

| Laravel | Express |
|---------|---------|
| Eloquent ORM | Sequelize ORM |
| Laravel Sanctum | JWT + HTTP-only cookies |
| Blade/Inertia | React (client-side) |
| PHP | Node.js/JavaScript |

All API endpoints return the same JSON structure, so your frontend should work with minimal changes.

## Troubleshooting

### CORS Issues
Make sure `FRONTEND_URL` in `.env` matches your frontend URL exactly.

### Database Connection
Verify MySQL is running and credentials in `.env` are correct.

### Spotify API
Ensure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are valid.

## Development Notes

- The server auto-creates database tables on startup (Sequelize sync)
- In production, disable `sequelize.sync()` and use migrations
- Session secret and JWT secret should be strong random strings in production
- Enable HTTPS in production and set `secure: true` for cookies
