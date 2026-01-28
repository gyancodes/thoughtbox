<div align="center">
  <h1>📝 ThoughtBox</h1>
  <p><strong>A modern, minimalist note-taking application for organizing your thoughts</strong></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#deployment">Deployment</a>
  </p>

  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Appwrite-21.5-F02E65?style=flat-square&logo=appwrite" alt="Appwrite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
</div>

---

## ✨ Features

- **📝 Rich Note Management** - Create, edit, and organize notes with a clean, distraction-free interface
- **🔍 Powerful Search** - Instantly find notes with real-time search functionality
- **🔐 Secure Authentication** - User authentication powered by Appwrite
- **☁️ Cloud Sync** - Notes are securely stored and synced via Appwrite Database
- **🎨 Modern UI** - Beautiful, responsive design with smooth animations using Framer Motion
- **⚡ Lightning Fast** - Built with Vite for instant hot module replacement and optimized builds
- **📱 Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4, tw-animate-css |
| **Routing** | TanStack Router |
| **State Management** | Zustand, TanStack Query |
| **Backend/Auth** | Appwrite (BaaS) |
| **Animations** | Framer Motion |
| **UI Components** | Radix UI, Base UI |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
- [Appwrite](https://appwrite.io/) account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thoughtbox.git
   cd thoughtbox
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file** (see [Configuration](#configuration))

5. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your-project-id"
VITE_APPWRITE_PROJECT_NAME="thoughtbox"
VITE_APPWRITE_DATABASE_ID="your-database-id"
VITE_APPWRITE_NOTES_COLLECTION_ID="notes"
```

### Appwrite Setup

1. **Create an Appwrite Project**
   - Go to [Appwrite Console](https://cloud.appwrite.io/)
   - Create a new project

2. **Create a Database**
   - Navigate to Databases → Create Database
   - Note the Database ID

3. **Create the Notes Collection**
   - Create a collection named `notes`
   - Add the following attributes:

   | Attribute | Type | Required |
   |-----------|------|----------|
   | `noteId` | Integer | Yes |
   | `userId` | Integer | Yes |
   | `title` | String (255) | Yes |
   | `content` | String (10000) | No |
   | `createdDate` | DateTime | Yes |
   | `modifiedDate` | DateTime | No |

4. **Configure Collection Permissions**
   - Go to Collection Settings → Permissions
   - Add **Users** role with Create, Read, Update, Delete permissions

5. **Create Indexes** (for better performance)
   - Create an index on `userId` (ASC)
   - Create an index on `$updatedAt` (DESC)

## 📁 Project Structure

```
thoughtbox/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/
│   │   ├── layout/        # Navbar, Footer
│   │   ├── sections/      # Hero, Features, Deployment
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/
│   │   ├── api.ts         # API functions for notes CRUD
│   │   ├── appwrite.ts    # Appwrite client configuration
│   │   ├── queryClient.ts # TanStack Query client
│   │   └── utils.ts       # Utility functions
│   ├── pages/
│   │   ├── auth.tsx       # Login/Signup page
│   │   ├── dashboard.tsx  # Main notes dashboard
│   │   └── home.tsx       # Landing page
│   ├── routes/            # TanStack Router routes
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── router.ts          # Router configuration
├── .env                   # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import the project in [Netlify](https://netlify.com/)
3. Set build command: `bun run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy!

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) for the amazing backend-as-a-service
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Lucide](https://lucide.dev/) for beautiful icons
- [TanStack](https://tanstack.com/) for powerful routing and data fetching

---

<div align="center">
  <p>Made with ❤️ by the ThoughtBox Team</p>
  <p>
    <a href="https://github.com/yourusername/thoughtbox">⭐ Star us on GitHub</a>
  </p>
</div>
