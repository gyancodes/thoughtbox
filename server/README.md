# ThoughtBox Server

Backend API for the ThoughtBox note-taking application.

## Features

- 🔐 **Authentication**: Clerk-based user authentication
- 🗄️ **Database**: Neon PostgreSQL for scalable storage
- 🚀 **Performance**: Fast serverless database queries
- 🔒 **Security**: Helmet.js security headers, CORS protection
- 📝 **CRUD Operations**: Full note management (Create, Read, Update, Delete)
- 🔍 **User Isolation**: Notes are scoped to authenticated users
- 📊 **Health Monitoring**: Built-in health check endpoint

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Clerk Configuration
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key_here"

# CORS Configuration
FRONTEND_URL="http://localhost:5173"
```

### 3. Database Setup

Run the database migration to create tables:

```bash
npm run db:migrate
```

### 4. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Notes (Protected Routes)
All note endpoints require authentication via Clerk JWT token.

- `GET /api/notes` - Get all notes for the authenticated user
- `GET /api/notes/:id` - Get a specific note by ID
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note
- `POST /api/notes/bulk/delete` - Delete multiple notes

### Authentication

Include the Clerk JWT token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Database Schema

### Notes Table

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  title TEXT DEFAULT '',
  content JSONB NOT NULL,
  color TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Getting Your Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select existing one
3. Go to the "Connection Details" section
4. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Getting Your Clerk Secret Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy the "Secret Key" (starts with `sk_test_` or `sk_live_`)

## Development

### Project Structure

```
server/
├── config/
│   └── database.js      # Database connection and setup
├── routes/
│   ├── health.js        # Health check endpoints
│   └── notes.js         # Notes CRUD endpoints
├── scripts/
│   └── migrate.js       # Database migration script
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

### Error Handling

The API includes comprehensive error handling:

- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource (e.g., note ID already exists)
- **500 Internal Server Error**: Server or database errors

### Logging

The server uses Morgan for HTTP request logging in combined format, which includes:
- Remote IP address
- Request timestamp
- HTTP method and URL
- Response status code
- Response size
- User agent

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="your_production_neon_url"
CLERK_SECRET_KEY="your_production_clerk_secret"
FRONTEND_URL="https://your-frontend-domain.com"
```

### Health Check

Monitor your deployment with the health endpoint:

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```