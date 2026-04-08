import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Lock, Zap, Layers, Search, Clock, FileText, Star, ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const bentoItems = [
    { col: "col-span-2 row-span-2", icon: FileText, title: "Rich Editor", desc: "Markdown with live preview", size: "large" },
    { col: "", icon: Star, title: "Favorites", desc: "Pin important notes", size: "small" },
    { col: "", icon: Clock, title: "Recent", desc: "Quick access", size: "small" },
    { col: "", icon: Lock, title: "Encrypted", desc: "Zero knowledge", size: "small" },
    { col: "col-span-2", icon: Search, title: "Instant Search", desc: "Find anything fast", size: "wide" },
    { col: "", icon: Zap, title: "Lightning", desc: "Works offline", size: "small" },
    { col: "", icon: Layers, title: "Organize", desc: "Folders & tags", size: "small" },
  ];

  const checks = ["End-to-end encrypted", "Free forever", "No credit card"];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <motion.div className="fixed top-0 left-0 right-0 z-[100] h-1 origin-left bg-primary" style={{ scaleX }} />

      <Navbar />

      <main>
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_50%,transparent)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)]" />
            <div className="absolute right-0 top-0 h-96 w-96 rounded-l-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-r-full bg-primary/5 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {checks.map((check, i) => (
                <motion.div
                  key={check}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium"
                >
                  <Check className="h-3 w-3 text-primary" />
                  {check}
                </motion.div>
              ))}
            </div>

            <h1 className="text-center text-4xl font-display font-bold tracking-tight md:text-5xl lg:text-6xl">
              A quiet place for your <span className="text-primary">thoughts</span>
            </h1>
            
            <p className="mx-auto mt-5 max-w-lg text-center text-muted-foreground md:text-lg">
              Write, organize, and keep your notes in one simple space.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "var(--secondary)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg border border-border px-6 py-3 text-sm font-medium"
                >
                  Sign in
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 w-full max-w-4xl"
          >
            <div className="rounded-2xl border border-border bg-card/50 p-3">
              <div className="relative overflow-hidden rounded-xl border border-border/50 bg-background">
                <div className="absolute inset-0 grid grid-cols-6 gap-px p-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="bg-card/30" />
                  ))}
                </div>
                <div className="relative p-4">
                  <div className="flex items-center gap-2 rounded-lg bg-card p-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                      <div className="h-2.5 w-2.5 rounded-full bg-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bentoItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className={`${item.col} group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_3%,transparent)_0%,transparent_100%)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-8 text-center md:p-12"
            >
              <h2 className="text-2xl font-bold">Ready to start?</h2>
              <p className="mt-2 text-muted-foreground">Join thousands of writers.</p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 rounded-lg bg-primary px-8 py-2.5 font-semibold text-primary-foreground"
                >
                  Get started free
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}