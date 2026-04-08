import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Sparkles, KeyRound, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | undefined;

    try {
      if (isLogin) {
        await api.login(email, password);
      } else {
        await api.signup(email, password, name);
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden bg-background font-sans lg:grid-cols-2">
      <div className="relative z-10 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 lg:py-0 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-10">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              T
            </div>
            <h1 className="mb-2 text-3xl font-display font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to access your notes."
                : "Start writing in seconds."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  At least 8 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "No account?" : "Already have one?"}{" "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden bg-[linear-gradient(160deg,#0a0a0a_0%,#0f1f1f_55%,#0a1515_100%)] lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12)_0%,transparent_40%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.06)_0%,transparent_40%)]" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full max-w-md px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-primary/80">
                <Lock className="h-3 w-3" />
                End-to-end encrypted
              </div>
              
              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                Your thoughts, protected.
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Simple note-taking with military-grade encryption.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Zero Knowledge</div>
                    <div className="text-xs text-slate-400">We can't read your notes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Clean & Fast</div>
                    <div className="text-xs text-slate-400">No clutter, just writing</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 text-center text-xs text-slate-500"
            >
              Join 10,000+ writers who trust ThoughtBox
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}