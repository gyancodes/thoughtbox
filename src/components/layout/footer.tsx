import { Link } from "@tanstack/react-router";
import { Github, Twitter, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              T
            </div>
            <span className="text-sm font-medium">ThoughtBox</span>
          </div>

          <div className="flex flex-col items-center gap-6 text-sm text-muted-foreground md:flex-row">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/login" className="text-muted-foreground transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link to="/signup" className="text-muted-foreground transition-colors hover:text-foreground">
              Get started
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 ThoughtBox. All rights reserved.
        </div>
      </div>
    </footer>
  );
}