import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Menu, Server, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/50"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              ThoughtBox
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </a>
          <Link href="/mobile">
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Mobile App
            </a>
          </Link>
          <a href="#deploy" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Server className="w-3 h-3" />
            Self-Host
          </a>
          <div className="h-4 w-px bg-border/50 mx-2" />
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-transparent">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-6 shadow-lg shadow-primary/10">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border-border">
              <div className="flex flex-col gap-4 mt-8">
                <a href="#features" className="text-lg font-medium text-foreground">
                  Features
                </a>
                <Link href="/mobile">
                  <a className="text-lg font-medium text-foreground">
                    Mobile App
                  </a>
                </Link>
                <a href="#deploy" className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Self-Host
                </a>
                <div className="h-px bg-border/50 my-2" />
                <Link href="/login">
                  <Button variant="ghost" className="justify-start px-0 text-lg font-medium hover:bg-transparent hover:text-primary">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-primary text-primary-foreground rounded-full">
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
