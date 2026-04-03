import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Deployment } from "@/components/sections/deployment";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-foreground">
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-1 origin-left bg-primary"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <Features />
        <Deployment />

        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,var(--primary)_12%,transparent)_0%,transparent_55%)]" />
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_84%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_100%)] px-6 py-12 shadow-[0_30px_120px_-60px_rgba(37,99,235,0.55)] md:px-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Calm and simple
                </div>
                <h2 className="mt-6 text-4xl font-display font-bold tracking-tight md:text-5xl">
                  A soft place to keep what matters.
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  Write things down, come back to them later, and keep your thoughts
                  in one quiet space.
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/signup">
                  <button className="w-full rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] sm:w-auto">
                    Start writing free
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full rounded-full border border-border bg-background/90 px-10 py-4 text-base font-semibold text-foreground transition-colors hover:bg-secondary/70 sm:w-auto">
                    Sign in
                  </button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2">
                  Clean and quiet
                </span>
                <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2">
                  Easy to use
                </span>
                <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2">
                  Made for everyday notes
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
