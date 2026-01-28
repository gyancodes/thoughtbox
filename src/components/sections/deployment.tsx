import { motion } from "motion/react";
import { Cloud, Database, Shield, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Deployment() {
  return (
    <section id="deploy" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/10 skew-y-3 transform origin-top-left -z-10 h-full" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Cloud className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Powered by Appwrite</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Secure backend, <br/>
              <span className="text-muted-foreground">zero hassle.</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              ThoughtBox uses Appwrite as its backend-as-a-service, providing enterprise-grade security, 
              real-time sync, and reliable cloud storage. Focus on your ideas while we handle the infrastructure.
            </p>

            <div className="space-y-6">
              {[
                { icon: Database, title: "Cloud Database", desc: "Your notes are stored securely in Appwrite's managed database." },
                { icon: Shield, title: "Secure Authentication", desc: "Industry-standard auth with email/password and OAuth providers." },
                { icon: Zap, title: "Real-time Sync", desc: "Changes sync instantly across all your devices." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 border border-border/50">
                    <item.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <Link to="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Writing Now
                </Button>
              </Link>
              <a href="https://appwrite.io" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-border hover:bg-secondary">
                  Learn About Appwrite
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
            {/* Tech Stack Card */}
            <div className="bg-card rounded-xl border border-border/50 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-secondary/30 border-b border-border/50">
                <h3 className="font-semibold text-lg">Tech Stack</h3>
                <p className="text-sm text-muted-foreground">Modern, reliable, and fast</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: "React 19", desc: "Latest React with concurrent features", color: "bg-blue-500" },
                  { name: "TypeScript", desc: "Type-safe development", color: "bg-blue-600" },
                  { name: "Vite", desc: "Lightning-fast build tool", color: "bg-purple-500" },
                  { name: "Appwrite", desc: "Backend-as-a-Service", color: "bg-pink-500" },
                  { name: "Tailwind CSS", desc: "Utility-first styling", color: "bg-cyan-500" },
                  { name: "Framer Motion", desc: "Smooth animations", color: "bg-pink-400" },
                ].map((tech, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -right-4 -bottom-4 bg-card border border-border/50 p-4 rounded-xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Data Security</div>
                  <div className="font-bold text-sm">Enterprise Grade</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
