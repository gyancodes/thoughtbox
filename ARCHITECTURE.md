# ThoughtBox Architecture

This document describes the architecture and design decisions behind ThoughtBox.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React SPA)   │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   localStorage  │    │   Clerk Auth    │    │   Neon Cloud    │
│   (Offline)     │    │   (Identity)    │    │   (Hosting)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Design Principles

### 1. **Offline-First**
- Primary storage in localStorage for instant access
- API sync as enhancement, not requirement
- Graceful degradation when backend is unavailable

### 2. **Security by Design**
- User data isolation at database level
- JWT-based authentication with automatic refresh
- Input validation and sanitization
- CORS protection and security headers

### 3. **Performance-Focused**
- Lazy loading of components
- Optimized bundle splitting
- Efficient state management
- Minimal re-renders

### 4. **Developer Experience**
- Modern tooling (Vite, ESLint, Prettier)
- Hot module replacement
- TypeScript ready
- Comprehensive documentation

## 📁 Project Structure

```
thoughtbox/
├── 📁 .github/              # GitHub workflows and templates
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── 📁 public/               # Static assets
│   ├── favicon.ico
│   └── manifest.json
├── 📁 src/                  # Source code
│   ├── 📁 components/       # React components
│   │   ├── 📁 notes/        # Note-related components
│   │   │   ├── CreateNoteButton.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── NoteGrid.jsx
│   │   │   ├── TextNote.jsx
│   │   │   └── index.js
│   │   ├── 📁 ui/           # Reusable UI components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── index.js
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── LandingPage.jsx  # Landing page
│   │   └── SearchBar.jsx    # Search functionality
│   ├── 📁 contexts/         # React contexts
│   │   ├── ClerkAuthContext.jsx
│   │   └── NotesContext.jsx
│   ├── 📁 types/            # Type definitions
│   │   ├── index.js
│   │   ├── noteUtils.js
│   │   └── validation.js
│   ├── 📁 utils/            # Utility functions
│   │   └── api.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── 📁 server/               # Backend API (optional)
│   ├── 📁 config/           # Configuration files
│   ├── 📁 routes/           # API routes
│   ├── 📁 utils/            # Server utilities
│   ├── 📁 scripts/          # Database scripts
│   └── index.js             # Server entry point
├── 📄 README.md             # Project documentation
├── 📄 CONTRIBUTING.md       # Contribution guidelines
├── 📄 CHANGELOG.md          # Version history
├── 📄 LICENSE               # MIT license
├── 📄 package.json          # Dependencies and scripts
├── 📄 vite.config.js        # Vite configuration
├── 📄 tailwind.config.js    # Tailwind CSS configuration
├── 📄 eslint.config.js      # ESLint configuration
├── 📄 Dockerfile            # Docker container
├── 📄 docker-compose.yml    # Docker Compose setup
└── 📄 nginx.conf            # Nginx configuration
```

## 🔄 Data Flow

### Note Creation Flow
```
User Input → CreateNoteButton → NotesContext → API/localStorage → UI Update
```

### Authentication Flow
```
User Login → Clerk → JWT Token → API Requests → Protected Resources
```

### Sync Flow
```
localStorage ←→ NotesContext ←→ API ←→ Database
```

## 🧩 Component Architecture

### Core Components

#### **NotesContext**
- Central state management for notes
- Handles API communication
- Manages localStorage fallback
- Provides CRUD operations

#### **ClerkAuthContext**
- Wraps Clerk authentication
- Provides user state
- Handles token management

#### **Dashboard**
- Main application interface
- Orchestrates note operations
- Manages UI state

#### **NoteEditor**
- Modal-based note editing
- Supports multiple note types
- Auto-save functionality

#### **CreateNoteButton**
- Google Keep-style input
- Type selection
- Inline creation

## 🗄️ Data Models

### Note Schema
```typescript
interface Note {
  id: string;                    // UUID
  user_id: string;              // Clerk user ID
  type: 'text' | 'todo' | 'timetable';
  title?: string;               // Optional title
  content: NoteContent;         // Type-specific content
  created_at: string;           // ISO timestamp
  updated_at: string;           // ISO timestamp
}
```

### Content Types
```typescript
// Text Note
interface TextContent {
  text: string;
}

// Todo List
interface TodoContent {
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

// Timetable
interface TimetableContent {
  entries: Array<{
    id: string;
    time: string;
    description: string;
    completed: boolean;
    date: string;
  }>;
}
```

## 🔐 Security Architecture

### Authentication
- **Clerk Integration**: Enterprise-grade auth service
- **JWT Tokens**: Secure API authentication
- **Session Management**: Automatic token refresh
- **Multi-factor Auth**: Optional 2FA support

### Data Protection
- **User Isolation**: Database-level user separation
- **Input Validation**: Comprehensive sanitization
- **CORS Protection**: Proper cross-origin handling
- **Security Headers**: XSS, CSRF, and clickjacking protection

### API Security
```typescript
// Example middleware stack
app.use(helmet());              // Security headers
app.use(cors(corsOptions));     // CORS protection
app.use(clerkMiddleware());     // Authentication
app.use(validateInput);         // Input validation
app.use(rateLimiter);          // Rate limiting
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Layout Strategy
- **Mobile**: Single column, full-width cards
- **Tablet**: Two-column grid, larger touch targets
- **Desktop**: Multi-column masonry layout

## ⚡ Performance Optimizations

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format, lazy loading

### Backend
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient DB connections
- **Caching**: Redis for session storage
- **Compression**: Gzip response compression

## 🚀 Deployment Architecture

### Development
```
Local Machine → Vite Dev Server → Hot Reload
```

### Staging
```
GitHub → Actions CI → Docker Build → Staging Server
```

### Production
```
GitHub → Actions CI → Docker Build → Registry → Production Server
```

### Infrastructure Options

#### **Option 1: Static Hosting**
- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Railway, Render, Heroku
- Database: Neon, Supabase, PlanetScale

#### **Option 2: Container Deployment**
- Platform: Docker + Kubernetes
- Registry: Docker Hub, GitHub Container Registry
- Orchestration: K8s, Docker Swarm

#### **Option 3: Serverless**
- Frontend: Vercel, Netlify
- Backend: Vercel Functions, Netlify Functions
- Database: Serverless PostgreSQL

## 🔄 State Management

### Context Architecture
```
App
├── ClerkAuthProvider
│   └── NotesProvider
│       └── Dashboard
│           ├── CreateNoteButton
│           ├── NoteGrid
│           └── NoteEditor
```

### State Flow
1. **Authentication State**: Managed by ClerkAuthContext
2. **Notes State**: Managed by NotesContext
3. **UI State**: Local component state
4. **Form State**: Controlled components

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Utility functions
- Context providers
- API functions

### Integration Tests
- User workflows
- API endpoints
- Database operations
- Authentication flows

### E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile responsiveness
- Performance testing

## 📊 Monitoring & Analytics

### Error Tracking
- Frontend: Sentry, LogRocket
- Backend: Winston, Morgan
- Database: Query monitoring

### Performance Monitoring
- Core Web Vitals
- Bundle size tracking
- API response times
- Database query performance

### User Analytics
- Usage patterns
- Feature adoption
- Error rates
- Performance metrics

## 🔮 Future Architecture Considerations

### Scalability
- **Microservices**: Split backend into services
- **CDN**: Global content delivery
- **Caching**: Redis, Memcached
- **Load Balancing**: Multiple server instances

### Features
- **Real-time Sync**: WebSocket connections
- **Collaboration**: Operational transforms
- **Mobile Apps**: React Native
- **Desktop Apps**: Electron

### Infrastructure
- **Kubernetes**: Container orchestration
- **Service Mesh**: Istio for microservices
- **Observability**: Prometheus, Grafana
- **CI/CD**: GitOps with ArgoCD