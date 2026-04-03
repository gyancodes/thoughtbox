import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Cloud,
  Database,
  LockKeyhole,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Deployment() {
  return (
    <section id="deploy" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--primary)_8%,transparent)_0%,transparent_42%)]" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <Cloud className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Made to feel safe
              </span>
            </div>

            <h2 className="mb-6 text-4xl font-display font-bold md:text-5xl">
              Made to feel easy, every day.
            </h2>

            <p className="mb-8 text-lg leading-8 text-muted-foreground">
              ThoughtBox gives you a calm place to write, with the kind of care
              that helps your notes stay safe and close.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Database,
                  title: "Saved with care",
                  desc: "Your notes stay in one place, ready whenever you come back.",
                },
                {
                  icon: Shield,
                  title: "Just for you",
                  desc: "Your writing space feels personal and protected.",
                },
                {
                  icon: Zap,
                  title: "Easy to return to",
                  desc: "Pick up where you left off without losing your flow.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-secondary/50">
                    <item.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Writing Now
                </Button>
              </Link>
              <a href="https://appwrite.io" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-border bg-background/80 hover:bg-secondary">
                  Learn more
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/85 shadow-[0_35px_100px_-55px_rgba(15,23,42,0.55)] backdrop-blur">
              <div className="border-b border-border/60 bg-secondary/35 px-6 py-5">
                <h3 className="text-lg font-semibold">A gentle rhythm</h3>
                <p className="text-sm text-muted-foreground">
                  Small moments that make writing feel lighter
                </p>
              </div>

              <div className="grid gap-4 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: "Open", value: "Write" },
                    { label: "Pause", value: "Save" },
                    { label: "Return", value: "Continue" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-border/60 bg-secondary/30 p-4"
                    >
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="mt-2 text-lg font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>

                {[
                  { name: "Soft layout", desc: "The page stays clean and easy to follow." },
                  { name: "Quiet colors", desc: "Blue, black, and white keep everything calm." },
                  { name: "Gentle motion", desc: "Small movement adds life without distraction." },
                  { name: "Simple flow", desc: "It feels easy to start, stop, and return." },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-4 py-4 transition-colors hover:bg-secondary/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                      <Cloud className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -right-4 -bottom-4 rounded-2xl border border-border/70 bg-background/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/12 p-2">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Peace of mind</div>
                  <div className="text-sm font-bold">Your notes stay close</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
