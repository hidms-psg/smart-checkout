import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sun, Moon, Zap } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearch: (q: string) => void;
}

export default function Navbar({ searchQuery, onSearch }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 pos-glass border-b border-border px-4 md:px-6 py-3"
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-heading font-bold text-foreground hidden sm:block">
            SmartPOS
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pos-input w-full pl-9"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Clock */}
          <span className="font-mono text-sm text-muted-foreground hidden md:block tabular-nums">
            {time.toLocaleTimeString()}
          </span>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            {dark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-heading font-semibold text-primary">
            SP
          </div>
        </div>
      </div>
    </motion.header>
  );
}
