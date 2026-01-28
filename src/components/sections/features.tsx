import { motion } from "motion/react";
import { 
  Zap, 
  Shield, 
  Cloud, 
  Palette, 
  Search,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Vite and React 19 for instant loading and smooth interactions."
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Your notes are securely stored and synced via Appwrite's reliable cloud infrastructure."
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Enterprise-grade security with Appwrite authentication. Your data stays protected."
  },
  {
    icon: Search,
    title: "Powerful Search",
    description: "Find any note instantly with real-time search across all your content."
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Modern, minimalist interface with smooth animations powered by Framer Motion."
  },
  {
    icon: Smartphone,
    title: "Responsive",
    description: "Works seamlessly on desktop, tablet, and mobile devices with adaptive layouts."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/30 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Crafted for <span className="text-primary">flow state.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every interaction is designed to keep you in the zone. No clutter, just your thoughts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
