import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Deployment } from "@/components/sections/deployment";
import { Footer } from "@/components/layout/footer";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <Features />
        <Deployment />

        {/* Call to Action Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/20 pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to organize your thoughts?
            </h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of thinkers, writers, and developers who use
              ThoughtBox to stay focused.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <button className="w-full sm:w-auto bg-primary text-primary-foreground font-bold text-lg py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                  Get Started for Free
                </button>
              </Link>
              <Link to="/login">
                <button className="w-full sm:w-auto bg-card hover:bg-secondary border border-border text-foreground font-bold text-lg py-4 px-10 rounded-full transition-colors">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
