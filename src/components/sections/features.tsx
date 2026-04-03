import { motion } from "motion/react";
import {
  Cloud,
  LayoutTemplate,
  LockKeyhole,
  ScanSearch,
  Search,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LayoutTemplate,
    title: "Clean",
    description: "A simple layout keeps your notes easy on the eyes.",
  },
  {
    icon: Zap,
    title: "Quick",
    description: "Everything feels light and smooth while you write.",
  },
  {
    icon: Search,
    title: "Easy to find",
    description: "Your notes are easy to come back to when you need them.",
  },
  {
    icon: Cloud,
    title: "Always there",
    description: "Your writing stays with you, ready when you return.",
  },
  {
    icon: LockKeyhole,
    title: "Private",
    description: "Your space feels personal, safe, and made for your own thoughts.",
  },
  {
    icon: Workflow,
    title: "Peaceful",
    description: "Less noise, less clutter, and more room to think clearly.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Made to feel easy
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold md:text-5xl">
            A note app that feels light and clear.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Everything is kept simple so writing feels natural and calm.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-[1.75rem] border border-border/70 bg-background/75 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_60px_-40px_rgba(37,99,235,0.45)] backdrop-blur"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="leading-7 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--secondary)_85%,white)_0%,color-mix(in_oklab,var(--card)_80%,white)_100%)] p-6 md:grid-cols-3">
          {[
            {
              icon: ScanSearch,
              title: "Easy to read",
              text: "Words, spacing, and contrast feel softer and clearer.",
            },
            {
              icon: Cloud,
              title: "Steady",
              text: "The whole app now feels more balanced from page to page.",
            },
            {
              icon: LockKeyhole,
              title: "Comforting",
              text: "The overall tone is quieter, warmer, and easier to trust.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.25rem] border border-border/60 bg-background/70 p-5"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
