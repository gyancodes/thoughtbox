# ThoughtBox

ThoughtBox is a note-taking app with a simple writing space, account login, and cloud-backed note storage.

This README is written for two people:

- A user who wants to understand what the app does
- A developer who wants to run or work on the project

## What the app does

ThoughtBox lets people:

- create an account
- sign in
- write and edit notes
- search notes
- keep notes available across sessions

## User flow

1. Open the landing page
2. Create an account or sign in
3. Go to the dashboard
4. Create, edit, search, and manage notes

## Tech used

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- TanStack Query
- Appwrite
- Motion

## Run locally

### Requirements

- Node.js 18 or newer
- npm
- An Appwrite project

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root and add:

```env
VITE_APPWRITE_PROJECT_ID="your-project-id"
VITE_APPWRITE_PROJECT_NAME="thoughtbox"
VITE_APPWRITE_ENDPOINT="https://your-appwrite-endpoint/v1"
VITE_APPWRITE_DATABASE_ID="your-database-id"
VITE_APPWRITE_NOTES_COLLECTION_ID="notes"
VITE_APPWRITE_ENCRYPTED_NOTES_ID="encrypted_notes"
VITE_APPWRITE_USER_KEYS_ID="user_keys"
```

### Start the app

```bash
npm run dev
```

Then open `http://localhost:5173`.

## Appwrite setup

Create these in Appwrite:

### Database

- one database for the app

### Collections

- `notes`
- `encrypted_notes`
- `user_keys`

### Minimum setup notes

- make sure the project values match your `.env`
- allow signed-in users to work with their own data
- create the fields your app expects before testing note creation

If you are onboarding as a developer, the fastest path is to open the existing Appwrite schema used by the team and mirror it in your own project.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project structure

```text
src/
  components/   reusable UI and page sections
  lib/          appwrite, api, crypto, and helpers
  pages/        landing, auth, and dashboard pages
  routes/       route definitions
  main.tsx      app entry
  router.ts     router setup
```

## Main files for onboarding

If you are new to the codebase, start here:

- `src/pages/home.tsx` for the landing page
- `src/pages/auth.tsx` for login and signup
- `src/pages/dashboard.tsx` for the main note experience
- `src/lib/api.ts` for note and auth calls
- `src/lib/appwrite.ts` for Appwrite client setup
- `src/index.css` for global theme and styles

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## Common setup checks

- If login fails, check your Appwrite endpoint, project ID, and permissions
- If notes do not load, check the database ID and collection IDs
- If the app starts but looks broken, confirm dependencies installed correctly with `npm install`

## Contributing

When making changes:

- keep the UI simple and readable
- avoid changing unrelated files
- run `npm run build` before handing work off

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
