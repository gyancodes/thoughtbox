import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LockKeyhole, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_65%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_55%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        <motion.div
          className="absolute -top-28 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/18 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-14%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-primary/12 blur-[140px]"
          animate={{ x: [0, -70, 0], y: [0, 40, 0], scale: [1.04, 0.96, 1.04] }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-12rem] left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 rounded-full bg-foreground/6 blur-[130px]"
          animate={{ y: [0, -30, 0], scaleX: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--primary)_18%,transparent)_0%,transparent_60%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm backdrop-blur"
          >
            <LockKeyhole className="h-3.5 w-3.5" />
            Calm notes, kept close
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-4xl text-5xl font-display font-bold tracking-tight text-balance md:text-7xl md:leading-[1.02]"
          >
            A quiet home for your thoughts.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
          >
            Write what matters, keep it close, and come back to it whenever you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start for free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border bg-background/75 px-8 text-base font-medium hover:border-primary/40 hover:bg-secondary/60"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Simple, calm, and made for everyday writing.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
