# ThoughtBox 🧠✨

> A modern, secure, and beautiful note-taking application built with React, PostgreSQL, and Clerk authentication.
>
> ![alt text](image.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.8-38B2AC.svg)](https://tailwindcss.com/)

## 🌟 Features

### 📝 **Multiple Note Types**
- **Text Notes**: Rich text editing for general note-taking
- **Todo Lists**: Interactive checklists with progress tracking  
- **Timetables**: Schedule management with time-based entries

### 🔐 **Enterprise-Grade Security**
- **Clerk Authentication**: Multi-factor authentication, social login, session management
- **User Isolation**: Database-level user data separation
- **Secure API**: JWT-based authentication with automatic token refresh

### 🎨 **Beautiful Design**
- **Google Keep Inspired**: Clean, intuitive interface
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Apple-Style Animations**: Smooth transitions and micro-interactions
- **Glassmorphism UI**: Modern backdrop blur effects

### ⚡ **Performance & Reliability**
- **Dual Storage**: Automatic fallback between API and localStorage
- **Real-time Sync**: Notes sync across devices instantly
- **Offline Support**: Continue working without internet connection
- **Fast Search**: Full-text search with instant results

### 🛠️ **Developer Experience**
- **Modern Stack**: React 19, Vite, Tailwind CSS 4
- **Type Safety**: Full TypeScript support
- **Hot Reload**: Lightning-fast development
- **ESLint**: Code quality and consistency

## 🚀 Quick Start

### Option 1: Frontend Only (localStorage)

Perfect for trying out ThoughtBox or local-only usage:

```bash
# Clone the repository
git clone https://github.com/your-username/thoughtbox.git
cd thoughtbox

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and start taking notes! All data is stored locally in your browser.

### Option 2: Full Stack (with Backend)

For production use with user accounts and cloud sync:

```bash
# Clone and setup
git clone https://github.com/your-username/thoughtbox.git
cd thoughtbox
npm install

# Setup backend (creates server directory and installs dependencies)
npm run setup-backend

# Configure environment variables (see Configuration section)
# Then start both frontend and backend
npm run dev:full
```

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **PostgreSQL** database (we recommend [Neon](https://neon.tech))
- **Clerk** account for authentication

## ⚙️ Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key_here"

# API Configuration (optional - for backend integration)
VITE_API_BASE_URL="http://localhost:3001/api"

# App Configuration
VITE_APP_NAME="ThoughtBox"
VITE_APP_VERSION="1.0.0"
```

### Backend Environment Variables

Create a `server/.env` file:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Clerk Configuration
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key_here"
CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key_here"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"
```

## 🗄️ Database Setup

### Using Neon (Recommended)

1. **Create Account**: Visit [neon.tech](https://neon.tech) and sign up
2. **Create Project**: Create a new PostgreSQL project
3. **Get Connection String**: Copy your database URL
4. **Update Environment**: Add the URL to `server/.env`

### Database Schema

The application uses a simple, efficient schema:

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'todo', 'timetable')),
  title VARCHAR(255),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_type ON notes(type);
```

## 🔐 Authentication Setup

### Clerk Configuration

1. **Create Account**: Visit [clerk.com](https://clerk.com) and sign up
2. **Create Application**: Set up a new application
3. **Configure Sign-in Methods**: Enable email, social providers, etc.
4. **Get Keys**: Copy your publishable and secret keys
5. **Update Environment**: Add keys to your `.env` files

### Supported Authentication Methods

- **Email/Password**: Traditional authentication
- **Social Login**: Google, GitHub, Discord, and more
- **Magic Links**: Passwordless authentication
- **Multi-Factor Authentication**: Optional 2FA for enhanced security

## 🏗️ Self-Hosting

### Docker Deployment (Recommended)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "server"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  thoughtbox:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=thoughtbox
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Manual Deployment

1. **Build Frontend**: `npm run build`
2. **Setup Server**: Configure production environment
3. **Database Migration**: Run database setup scripts
4. **Process Manager**: Use PM2 or similar for process management
5. **Reverse Proxy**: Configure Nginx or Apache
6. **SSL Certificate**: Setup HTTPS with Let's Encrypt

## 🛠️ Development

### Project Structure

```
thoughtbox/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── notes/         # Note-related components
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   └── types/             # Type definitions
├── server/                # Backend API server
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   ├── utils/             # Server utilities
│   └── scripts/           # Database scripts
├── public/                # Static assets
└── dist/                  # Built frontend
```

### Available Scripts

```bash
# Development
npm run dev              # Start frontend only
npm run dev:full         # Start frontend + backend
npm run server           # Start backend only

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Backend Setup
npm run setup-backend    # Initialize backend

# Code Quality
npm run lint             # Run ESLint
```

### API Endpoints

The backend provides a RESTful API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Fetch user's notes |
| `POST` | `/api/notes` | Create new note |
| `PUT` | `/api/notes/:id` | Update existing note |
| `DELETE` | `/api/notes/:id` | Delete note |
| `GET` | `/api/health` | Health check |

### Note Data Structure

```typescript
interface Note {
  id: string;
  user_id: string;
  type: 'text' | 'todo' | 'timetable';
  title?: string;
  content: {
    // Text notes
    text?: string;
    
    // Todo lists
    items?: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
    
    // Timetables
    entries?: Array<{
      id: string;
      time: string;
      description: string;
      completed: boolean;
      date: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/thoughtbox.git`
3. **Create a branch**: `git checkout -b feature/amazing-feature`
4. **Install dependencies**: `npm install`
5. **Start development**: `npm run dev`
6. **Make your changes**
7. **Test thoroughly**
8. **Submit a pull request**

### Code Style

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **Conventional Commits**: Use conventional commit messages
- **TypeScript**: Maintain type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clerk** for authentication infrastructure
- **Neon** for PostgreSQL hosting
- **Tailwind CSS** for the design system
- **React** team for the amazing framework
- **Vite** for the blazing fast build tool

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/your-username/thoughtbox/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/thoughtbox/discussions)
- **Email**: support@thoughtbox.dev

## 🗺️ Roadmap

- [ ] **Mobile Apps**: React Native iOS/Android apps
- [ ] **Collaboration**: Real-time collaborative editing
- [ ] **Plugins**: Extension system for custom note types
- [ ] **Themes**: Dark mode and custom themes
- [ ] **Export**: PDF, Markdown, and other export formats
- [ ] **Encryption**: End-to-end encryption for sensitive notes
- [ ] **API**: Public API for third-party integrations

---

<div align="center">

**Made with ❤️ by the ThoughtBox team**

[Website](https://thoughtbox.dev) • [Documentation](https://docs.thoughtbox.dev) • [Community](https://discord.gg/thoughtbox)

</div>