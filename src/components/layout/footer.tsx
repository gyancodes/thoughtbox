import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                T
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                ThoughtBox
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Open source note-taking for the modern web. Built with privacy, speed, and aesthetics in mind.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Download</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 ThoughtBox Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
