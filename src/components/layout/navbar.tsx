import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground"
            >
              T
            </motion.div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ThoughtBox
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/signup">Get started</Link>
              </Button>
            </motion.div>
          </div>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                showCloseButton={false}
                className="border-0 bg-background/96 p-0 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  className="flex min-h-screen flex-col"
                >
                  <div className="flex items-center justify-between border-b border-border/60 px-5 py-5">
                    <Link
                      to="/"
                      className="flex items-center gap-2"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                        T
                      </div>
                      <span className="text-lg font-semibold tracking-tight text-foreground">
                        ThoughtBox
                      </span>
                    </Link>

                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-6">
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/30"
                          onClick={() => setOpen(false)}
                        >
                          Sign in
                        </Link>
                      </SheetClose>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full rounded-full bg-primary text-primary-foreground"
                        >
                          <Link to="/signup">Get started</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-primary/50"
        style={{ scaleX, opacity: scrollYProgress }}
      />
    </>
  );
}