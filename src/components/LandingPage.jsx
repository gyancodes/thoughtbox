import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { motion } from "motion/react";

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  // Mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.01,
        y: (e.clientY - window.innerHeight / 2) * 0.01,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-50 rounded-full opacity-20 floating-bg"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-blue-50 rounded-full opacity-15 floating-bg"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* Easter egg: Hidden floating dot */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-0"
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-7 h-7 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-900">
                ThoughtBox
              </span>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="https://docs.thoughtbox.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Docs
              </a>

              <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <motion.button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </SignUpButton>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="md:hidden">
              <SignUpButton mode="modal">
                <motion.button
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                  whileTap={{ scale: 0.95 }}
                >
                  Start
                </motion.button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Fits on one page */}
      <main className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Status Badge */}
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-6 bg-blue-50 border border-blue-200 text-blue-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Open Source • Privacy First • Self-Hostable
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Your digital workspace
              <br />
              <span className="text-blue-600 font-normal">
                for capturing thoughts
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              A minimal, fast note-taking application that works offline and
              puts your privacy first. Organize your thoughts with text notes,
              todo lists, and timetables—all synced across your devices.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <SignUpButton mode="modal">
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Trial
                </motion.button>
              </SignUpButton>

              <motion.a
                href="https://demo.thoughtbox.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Demo
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="space-y-1">
                <div className="text-xl font-medium text-gray-900">10,000+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-medium text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-medium text-gray-900">
                  Open Source
                </div>
                <div className="text-sm text-gray-500">MIT Licensed</div>
              </div>
            </motion.div>
          </div>

          {/* Product Preview - Compact */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="relative rounded-xl shadow-xl overflow-hidden border border-gray-200 bg-white">
              {/* Browser Bar */}
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-600 inline-block border border-gray-200">
                    app.thoughtbox.dev
                  </div>
                </div>
              </div>

              {/* App Interface - Compact */}
              <div className="p-4 bg-gray-50 min-h-64">
                <div className="space-y-3">
                  {/* Search/Input Bar */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-xs">
                        Search notes or create new...
                      </span>
                    </div>
                  </div>

                  {/* Sample Notes Grid - Compact */}
                  <div className="grid md:grid-cols-3 gap-3">
                    <motion.div
                      className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                      whileHover={{
                        y: -1,
                        shadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900 mb-1">
                        Project Planning
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Define project scope and timeline...
                      </div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </motion.div>

                    <motion.div
                      className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                      whileHover={{
                        y: -1,
                        shadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900 mb-1">
                        Meeting Notes
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        • Review design mockups...
                      </div>
                      <div className="text-xs text-gray-400">Yesterday</div>
                    </motion.div>

                    <motion.div
                      className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                      whileHover={{
                        y: -1,
                        shadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900 mb-1">
                        Ideas
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        New feature concepts...
                      </div>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Everything you need to capture ideas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Designed for productivity with features that help you organize,
              search, and sync your thoughts seamlessly.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Lightning Fast Search",
                description:
                  "Find any note instantly with our advanced full-text search. Search across all your content, including tags and metadata.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Offline First",
                description:
                  "Your notes are always accessible. Work offline and sync automatically when you're back online. No internet dependency.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ),
              },
              {
                title: "Multiple Formats",
                description:
                  "Create text notes, todo lists, and timetables. Organize content with tags, folders, and custom categories.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14-7H5m14 14H5"
                    />
                  </svg>
                ),
              },
              {
                title: "Privacy Focused",
                description:
                  "End-to-end encryption ensures your data stays private. We can't read your notes—only you can access them.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
              {
                title: "Real-time Sync",
                description:
                  "Access your notes on any device. Changes sync instantly across web, desktop, and mobile applications.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ),
              },
              {
                title: "Open Source",
                description:
                  "Fully open source under MIT license. Self-host on your infrastructure or contribute to the codebase on GitHub.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">
                  Built for developers and teams
                </h2>
                <p className="text-lg text-gray-600 mb-8 font-light">
                  Deploy ThoughtBox in minutes with Docker, or integrate it into
                  your existing infrastructure. Built with modern technologies
                  for scalability and performance.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Docker Deployment
                      </h4>
                      <p className="text-gray-600 text-sm">
                        One-command deployment with docker-compose.
                        Production-ready with SSL and monitoring included.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Enterprise Security
                      </h4>
                      <p className="text-gray-600 text-sm">
                        End-to-end encryption, SOC 2 compliance, and audit logs
                        for enterprise deployments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        API Integration
                      </h4>
                      <p className="text-gray-600 text-sm">
                        RESTful API for custom integrations. Webhooks, SSO, and
                        third-party service connections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs ml-3">terminal</span>
                  </div>

                  <div className="font-mono text-xs space-y-2">
                    <div className="text-gray-400">
                      # Deploy ThoughtBox in seconds
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>
                        git clone https://github.com/thoughtbox/thoughtbox.git
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>cd thoughtbox && docker-compose up -d</span>
                    </div>
                    <div className="text-green-400 mt-3">
                      ✓ Running on http://localhost:3000
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Pricing Section */}
        <div
          id="pricing"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Start free, upgrade when you need more features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "Up to 1,000 notes",
                  "Basic search",
                  "Web access",
                  "Community support",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$8",
                period: "per month",
                features: [
                  "Unlimited notes",
                  "Advanced search",
                  "Mobile & desktop apps",
                  "Priority support",
                  "End-to-end encryption",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                features: [
                  "Everything in Pro",
                  "Self-hosted deployment",
                  "SSO integration",
                  "Audit logs",
                  "Dedicated support",
                  "Custom integrations",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-xl p-6 ${
                  plan.popular
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3
                    className={`text-lg font-medium mb-3 ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span
                      className={`text-3xl font-light ${
                        plan.popular ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      /{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <svg
                          className={`w-4 h-4 mr-2 flex-shrink-0 ${
                            plan.popular ? "text-blue-200" : "text-blue-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span
                          className={
                            plan.popular ? "text-blue-100" : "text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <SignUpButton mode="modal">
                    <motion.button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                        plan.popular
                          ? "bg-white text-blue-600 hover:bg-gray-50"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.cta}
                    </motion.button>
                  </SignUpButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight">
                Ready to organize your thoughts?
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                Join thousands of users who have made ThoughtBox their digital
                brain. Start your free trial today—no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <motion.button
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Free Trial
                  </motion.button>
                </SignUpButton>

                <motion.a
                  href="https://docs.thoughtbox.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read Documentation
                </motion.a>
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-400 text-sm">
                  No setup fees • Cancel anytime • 30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">ThoughtBox</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  Your digital workspace for capturing and organizing thoughts,
                  built with privacy and performance in mind.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/changelog"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/roadmap"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Roadmap
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://docs.thoughtbox.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/thoughtbox/thoughtbox"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="/api"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/help"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/status"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      System Status
                    </a>
                  </li>
                  <li>
                    <a
                      href="/security"
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-light"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <span className="text-gray-500 text-sm font-light">
                  © 2025 ThoughtBox. All rights reserved.
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="/privacy"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors font-light"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors font-light"
                >
                  Terms of Service
                </a>
                <a
                  href="https://twitter.com/thoughtboxapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/thoughtbox/thoughtbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
