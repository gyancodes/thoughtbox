import { motion } from "motion/react";
import { Server, Database, Cloud, Lock, Terminal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <Server className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Deploy Anywhere</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Your data, <br/>
              <span className="text-muted-foreground">your infrastructure.</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              ThoughtBox is designed to be fully agnostic. Run it on our cloud for convenience, or deploy it on your own hardware for complete control. We provide official Docker images and one-click templates.
            </p>

            <div className="space-y-6">
              {[
                { icon: Database, title: "Own Your Database", desc: "Connect to your own Postgres or SQLite instance." },
                { icon: Lock, title: "Zero-Knowledge Encryption", desc: "Optional client-side encryption for ultimate privacy." },
                { icon: Terminal, title: "Single Binary", desc: "Written in Go/Rust for ease of deployment and speed." }
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
              <Button variant="outline" className="border-border hover:bg-secondary">
                Read Deployment Docs
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#1e1e1e] rounded-xl border border-border/50 shadow-2xl overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-2 text-xs text-muted-foreground">bash — 80x24</div>
              </div>
              <div className="p-6 space-y-4 text-gray-300">
                <div className="flex gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span>docker pull thoughtbox/server:latest</span>
                </div>
                <div className="text-gray-500">
                  latest: Pulling from thoughtbox/server<br/>
                  a3b2c1d4e5f6: Pull complete<br/>
                  Digest: sha256:8f9e...
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span>docker run -p 3000:3000 thoughtbox</span>
                </div>
                <div className="text-gray-500">
                  Starting ThoughtBox Server v2.0...<br/>
                  <span className="text-green-400">✓</span> Database connected<br/>
                  <span className="text-green-400">✓</span> API initialized<br/>
                  Server listening on port 3000 🚀
                </div>
                <div className="flex gap-2 animate-pulse">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="w-2 h-4 bg-gray-500 block"></span>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -right-8 -bottom-8 bg-card border border-border/50 p-4 rounded-xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Security Audit</div>
                  <div className="font-bold text-sm">Passed 100%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
