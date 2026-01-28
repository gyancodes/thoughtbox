import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sparkles, PenLine } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Powered by Appwrite</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight"
          >
            A quiet place for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              your best ideas.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Write notes, organize your thoughts, and find clarity.
            A modern note-taking app with secure cloud sync and beautiful design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-muted-foreground/20 hover:bg-secondary/50 transition-all hover:border-primary/50">
                <PenLine className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-sm text-muted-foreground/60"
          >
            No credit card required • Free forever for personal use
          </motion.p>
        </div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-black/50 bg-card"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* Mock Dashboard Preview */}
          <div className="p-4 md:p-8">
            <div className="flex gap-4">
              {/* Sidebar Mock */}
              <div className="hidden md:block w-64 bg-secondary/30 rounded-xl p-4 space-y-4">
                <div className="h-8 w-32 bg-primary/20 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-10 bg-primary/10 rounded-lg" />
                  <div className="h-10 bg-muted/50 rounded-lg" />
                  <div className="h-10 bg-muted/50 rounded-lg" />
                </div>
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="h-6 w-20 bg-muted/30 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-red-500/20 rounded-full" />
                    <div className="h-6 w-16 bg-blue-500/20 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Notes List Mock */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-10 bg-secondary/50 rounded-lg" />
                  <div className="h-10 w-10 bg-primary/20 rounded-lg" />
                </div>
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`p-4 rounded-xl border ${i === 1 ? 'bg-primary/5 border-primary/30' : 'bg-card border-border/50'}`}>
                      <div className="h-5 w-48 bg-foreground/10 rounded mb-2" />
                      <div className="space-y-1">
                        <div className="h-3 w-full bg-muted/50 rounded" />
                        <div className="h-3 w-3/4 bg-muted/50 rounded" />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <div className="h-5 w-14 bg-yellow-500/20 rounded-full" />
                        <div className="h-5 w-14 bg-green-500/20 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
