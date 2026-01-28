import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans overflow-hidden">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 py-12 lg:py-0">
        <div className="mb-8 lg:absolute lg:top-8 lg:left-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-6 shadow-lg shadow-primary/20">
              T
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Enter your credentials to access your workspace."
                : "Join thousands of thinkers organizing their minds."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" data-testid="error-message">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="h-11 bg-card border-border/50 focus:border-primary/50 transition-colors"
                  data-testid="input-name"
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
                className="h-11 bg-card border-border/50 focus:border-primary/50 transition-colors"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <a href="#" className="text-xs text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="h-11 bg-card border-border/50 focus:border-primary/50 transition-colors"
                data-testid="input-password"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              data-testid="button-submit"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-11 border-border/50 hover:bg-card hover:border-primary/30 transition-all">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="h-11 border-border/50 hover:bg-card hover:border-primary/30 transition-all">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link 
              to={isLogin ? "/signup" : "/login"}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:block relative bg-secondary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center p-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-square max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-border/20 bg-background/50 backdrop-blur-xl p-8"
          >
            {/* Abstract UI representation */}
            <div className="w-full h-full flex flex-col gap-4">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="h-8 w-1/3 bg-muted rounded-lg mb-6" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 rounded-xl bg-card border border-border/50 p-4">
                  <div className="h-4 w-3/4 bg-primary/20 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-5/6 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-40 rounded-xl bg-card border border-border/50 p-4 bg-primary/5 border-primary/20">
                  <div className="h-4 w-1/2 bg-primary/40 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-2/3 bg-muted rounded" />
                  </div>
                </div>
                <div className="col-span-2 h-32 rounded-xl bg-card border border-border/50 p-4">
                  <div className="h-4 w-1/4 bg-accent/20 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating quote */}
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl">
              <p className="text-sm font-medium italic text-muted-foreground">
                "ThoughtBox has completely transformed how I organize my research. It's the perfect balance of simplicity and power."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20" />
                <div>
                  <div className="text-xs font-bold">Sarah Chen</div>
                  <div className="text-[10px] text-muted-foreground">Product Designer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
