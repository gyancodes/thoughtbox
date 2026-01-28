import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Download, Server } from "lucide-react";
// import heroImage from "@"
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
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">v2.0 Public Beta is Live</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight"
          >
            Capture your mind in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              pure clarity.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            The open-source note-taking workspace for modern thinkers. 
            Free for individuals, easy to self-host for teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Download className="w-4 h-4 mr-2" />
              Start Writing
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-muted-foreground/20 hover:bg-secondary/50 transition-all hover:border-primary/50">
              <Server className="w-4 h-4 mr-2" />
              Self-Host Guide
            </Button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-sm text-muted-foreground/60"
          >
            Already have an account? <a href="#" className="underline hover:text-primary">Log in here</a>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-black/50"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          {/* <img 
            src={heroImage} 
            alt="ThoughtBox Interface" 
            className="w-full h-auto object-cover rounded-2xl"
          /> */}
        </motion.div>
      </div>
    </section>
  );
}
