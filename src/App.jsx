import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { ClerkAuthProvider } from "./contexts/ClerkAuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";
import "./index.css";

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <ClerkAuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <SignedIn>
                      <NotesProvider>
                        <Dashboard />
                      </NotesProvider>
                    </SignedIn>
                  }
                />

                {/* Redirect to sign in for protected routes when not authenticated */}
                <Route
                  path="/dashboard"
                  element={
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Toast notifications */}
              <Toaster />
            </div>
          </Router>
        </ClerkAuthProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
