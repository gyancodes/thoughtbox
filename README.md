# ThoughtBox

A secure notes app with client-side encryption. Your notes are encrypted before they leave your device.

## What it does

- Create and organize notes, todo lists, and timetables
- All data is encrypted on your device before syncing
- Works offline and syncs when connected
- Your encryption keys never leave your device

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Appwrite**
   - Create account at [cloud.appwrite.io](https://cloud.appwrite.io)
   - Create a new project
   - Copy your Project ID

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Add your Appwrite Project ID to `.env`:
   ```env
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

## Optional: Enable note storage

To save notes to the cloud:
1. Create a database in Appwrite console
2. Create a "notes" collection
3. Add database and collection IDs to `.env`

## Tech stack

- React + Vite
- Tailwind CSS
- Appwrite (backend)
- Client-side AES encryption

## Security

- Notes are encrypted with AES-256 before syncing
- Your password generates the encryption key
- Server cannot read your notes
- Open source and auditable

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```
