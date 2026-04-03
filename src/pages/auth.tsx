import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Github, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
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
        <div className="mb-8 lg:absolute lg:top-8 lg:left-8">
          <Link
            to="/"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-10">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              T
            </div>
            <h1 className="mb-2 text-3xl font-display font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Enter your credentials to access your workspace."
                : "Start with a calm space for your notes and ideas."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                data-testid="error-message"
              >
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
                  className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors"
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
                className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">
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
                className="h-11 border-border/50 bg-card focus:border-primary/50 transition-colors"
                data-testid="input-password"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90"
              data-testid="button-submit"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-11 border-border/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button
                variant="outline"
                className="h-11 border-border/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden bg-[linear-gradient(160deg,#081120_0%,#0f172a_55%,#12203e_100%)] lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28)_0%,transparent_35%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.16)_0%,transparent_34%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col gap-4 text-white">
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Calm and clear
              </div>
              <div className="mb-2">
                <h2 className="text-3xl font-display font-semibold tracking-tight">
                  A soft place to write and return to.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                  ThoughtBox keeps your space simple, quiet, and easy to come
                  back to whenever you need it.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Capture
                  </div>
                  <div className="mt-4 h-4 w-3/4 rounded-full bg-blue-400/35" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded-full bg-white/10" />
                    <div className="h-2 w-5/6 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-blue-100">
                    Organize
                  </div>
                  <div className="mt-4 h-4 w-1/2 rounded-full bg-blue-300/45" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded-full bg-white/12" />
                    <div className="h-2 w-full rounded-full bg-white/12" />
                    <div className="h-2 w-2/3 rounded-full bg-white/12" />
                  </div>
                </div>
                <div className="col-span-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Your space
                      </div>
                      <div className="mt-2 text-xl font-semibold">
                        Open, write, return
                      </div>
                    </div>
                    <div className="rounded-full bg-blue-400/15 p-3">
                      <LockKeyhole className="h-5 w-5 text-blue-200" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-white/10" />
                    <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-6 shadow-xl backdrop-blur-md">
              <p className="text-sm font-medium italic text-slate-200">
                "It feels calm, simple, and easy to keep coming back to."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-400/20" />
                <div>
                  <div className="text-xs font-bold text-white">Sarah Chen</div>
                  <div className="text-[10px] text-slate-400">Product Designer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
