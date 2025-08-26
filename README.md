# ThoughtBox

A modern, secure note-taking application with PostgreSQL database and Clerk authentication.

## What it does

- Create and organize notes, todo lists, and timetables
- Secure authentication with Clerk
- Real-time synchronization with PostgreSQL/Neon database
- Search and filter your notes efficiently

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Clerk Authentication**
   - Create account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Add your Clerk key to `.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Set up Database**
   - Create a Neon account at [neon.tech](https://neon.tech)
   - Create a new project and database
   - Set up your backend API server (not included in this repo)

5. **Run the app**
   ```bash
   npm run dev
   ```

## Backend Requirements

This frontend requires a backend API server with the following endpoints:
- `GET /api/notes` - Fetch user's notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Tech stack

- React + Vite
- Tailwind CSS
- PostgreSQL/Neon (database)
- Clerk (authentication)

## Security

- Secure authentication with Clerk
- User session management and token handling
- Database-level user isolation
- Open source and auditable

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```
