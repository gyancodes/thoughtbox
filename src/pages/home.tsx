import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Lock, Layers, Search, Clock, FileText, Star, ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const bentoItems = [
    { 
      col: "md:col-span-2 md:row-span-2", 
      icon: FileText, 
      title: "Rich Markdown Editor", 
      desc: "Experience writing with live preview, syntax highlighting, and seamless formatting. Focus on your thoughts, we handle the rest.", 
    },
    { 
      col: "md:col-span-1 md:row-span-1", 
      icon: Star, 
      title: "Favorites", 
      desc: "Pin your most important notes for instant access.", 
    },
    { 
      col: "md:col-span-1 md:row-span-1", 
      icon: Clock, 
      title: "Recent", 
      desc: "Pick up exactly where you left off.", 
    },
    { 
      col: "md:col-span-1 md:row-span-1", 
      icon: Lock, 
      title: "Private & Secure", 
      desc: "Your notes are locked. Nobody else can read them.", 
    },
    { 
      col: "md:col-span-1 md:row-span-1", 
      icon: Zap, 
      title: "Zero Setup", 
      desc: "Just start writing. We handle the sync securely.", 
    },
    { 
      col: "md:col-span-2 md:row-span-1", 
      icon: Search, 
      title: "Find it fast", 
      desc: "Instantly search through all your notes with just a few keystrokes.", 
    },
    { 
      col: "md:col-span-2 md:row-span-1", 
      icon: Layers, 
      title: "Stay organized", 
      desc: "Use simple folders and tags to keep everything in its right place.", 
    },
  ];

  const checks = ["End-to-end encrypted", "Free forever", "No credit card"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 overflow-hidden">
      <motion.div className="fixed top-0 left-0 right-0 z-[100] h-1 origin-left bg-gradient-to-r from-primary via-primary/50 to-primary" style={{ scaleX }} />

      <Navbar />

      <main className="relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div style={{ y }} className="absolute inset-0">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_50%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
          </motion.div>
          <div className="absolute top-0 right-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] left-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />
        </div>

        <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-32 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-8 flex flex-wrap justify-center gap-3">
              {checks.map((check, i) => (
                <div
                  key={check}
                  className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-md transition-colors hover:bg-primary/10"
                >
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                  {check}
                </div>
              ))}
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl font-display font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              A quiet place for <br className="hidden sm:block" />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary/80 pb-2">
                your thoughts
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 h-[0.15em] bg-primary/30 rounded-full"
                />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
              Write, organize, and keep your notes in one beautifully simple space. 
              Designed for focus, built for privacy.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_40px_8px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_60px_12px_rgba(var(--primary),0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/50 px-8 py-4 text-base font-medium backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Sparkles className="h-4 w-4" /> Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, type: "spring", bounce: 0.2 }}
            className="relative mt-20 w-full max-w-5xl px-4 perspective-1000"
          >
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotateX: [2, -2, 2]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-xl p-1 bg-gradient-to-b from-border/50 to-background/10 backdrop-blur-xl shadow-2xl ring-1 ring-border/50"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative overflow-hidden rounded-lg bg-card/80 border border-border/50 shadow-inner">
                {/* Mockup Header */}
                <div className="flex items-center border-b border-border/50 bg-background/50 px-4 py-3 backdrop-blur-md">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  </div>
                  <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-muted/50 text-[10px] font-medium text-muted-foreground">
                    thoughtbox-secure-notes
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="grid grid-cols-4 gap-px bg-border/20 h-[300px] sm:h-[400px]">
                  <div className="hidden sm:block col-span-1 bg-background/50 p-4">
                    <div className="space-y-3">
                      <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 w-3/4 rounded-full bg-muted/60 animate-pulse delay-75" />
                      <div className="h-4 w-1/2 rounded-full bg-muted/40 animate-pulse delay-150" />
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-3 bg-card p-6">
                    <div className="h-8 w-1/3 rounded-lg bg-muted animate-pulse mb-6" />
                    <div className="space-y-4">
                      <div className="h-4 w-full rounded-full bg-muted/60 animate-pulse delay-75" />
                      <div className="h-4 w-5/6 rounded-full bg-muted/50 animate-pulse delay-100" />
                      <div className="h-4 w-4/6 rounded-full bg-muted/40 animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section className="relative py-24 z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Everything you need. <br className="hidden sm:block" />
                <span className="text-muted-foreground">Nothing you don't.</span>
              </motion.h2>
            </div>

            <div className="grid gap-4 md:grid-cols-4 md:grid-rows-3 max-w-6xl mx-auto auto-rows-[minmax(180px,auto)]">
              {bentoItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05, duration: 0.5, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${item.col} group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 transition-all hover:border-primary/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Glow effect on hover */}
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-transform duration-700 group-hover:translate-x-10 group-hover:translate-y-10" />

                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-[90%]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 mt-12 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-10 text-center md:p-20 shadow-2xl"
            >
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative z-10 max-w-2xl mx-auto"
              >
                <h2 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">Start writing today</h2>
                <p className="text-lg text-muted-foreground mb-10">
                  Join thousands of users who have found focus and clarity. 
                  Zero setup required.
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-xl bg-foreground px-10 py-5 text-lg font-bold text-background shadow-xl transition-transform hover:shadow-2xl"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}