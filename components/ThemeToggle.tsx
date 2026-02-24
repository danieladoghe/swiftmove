'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] animate-pulse" />
  );

  const current = themes.find(t => t.value === theme) ?? themes[2];
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme"
        className="
          flex items-center justify-center w-9 h-9 rounded-lg
          border border-[var(--border)] bg-[var(--surface)]
          text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]
          transition-all duration-200 hover:shadow-[0_0_12px_var(--glow-soft)]
        "
      >
        <Icon size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-0 top-11 z-50 min-w-[130px]
                bg-[var(--surface)] border border-[var(--border)]
                rounded-xl shadow-[var(--shadow-lg)] p-1 flex flex-col gap-0.5
              "
            >
              {themes.map(({ value, icon: TIcon, label }) => (
                <button
                  key={value}
                  onClick={() => { setTheme(value); setOpen(false); }}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150 w-full text-left
                    ${theme === value
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }
                  `}
                >
                  <TIcon size={14} />
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
