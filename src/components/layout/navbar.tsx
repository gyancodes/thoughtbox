import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LogIn, Menu, Server, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300"
    >
      <div
        className={`container mx-auto flex h-16 items-center justify-between rounded-full border px-5 md:px-6 ${
          scrolled
            ? "border-border/70 bg-background/82 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-border/40 bg-background/55 backdrop-blur-md"
        }`}
      >
        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground transition-transform group-hover:scale-105">
            T
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            ThoughtBox
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </a>
          <a
            href="#deploy"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Server className="h-3.5 w-3.5" />
            Simple
          </a>
          <a
            href="#features"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Why ThoughtBox
          </a>
          <div className="mx-2 h-4 w-px bg-border/50" />
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-border bg-background">
              <div className="mt-8 flex flex-col gap-4">
                <a href="#features" className="text-lg font-medium text-foreground">
                  Features
                </a>
                <a
                  href="#deploy"
                  className="flex items-center gap-2 text-lg font-medium text-foreground"
                >
                  <Server className="h-4 w-4" />
                  Simple
                </a>
                <a
                  href="#features"
                  className="flex items-center gap-2 text-lg font-medium text-foreground"
                >
                  <Sparkles className="h-4 w-4" />
                  Why ThoughtBox
                </a>
                <div className="my-2 h-px bg-border/50" />
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="justify-start px-0 text-lg font-medium hover:bg-transparent hover:text-primary"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full rounded-full bg-primary text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
