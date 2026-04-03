import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                T
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                ThoughtBox
              </span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              A calm place to write, reflect, and keep your thoughts together.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="transition-colors hover:text-primary">
                  Features
                </a>
              </li>
              <li>
                <a href="#deploy" className="transition-colors hover:text-primary">
                  Simple
                </a>
              </li>
              <li>
                <Link to="/signup" className="transition-colors hover:text-primary">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-primary">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  X
                </a>
              </li>
              <li>
                <Link to="/" className="transition-colors hover:text-primary">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>2026 ThoughtBox. Made for quiet writing.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
