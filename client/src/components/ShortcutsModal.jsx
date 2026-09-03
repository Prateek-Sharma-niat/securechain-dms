import React, { useEffect } from 'react';
import { Command, X, Keyboard, Search, Moon, Home, LogIn, ArrowUp } from 'lucide-react';

export default function ShortcutsModal({
  isOpen,
  onClose,
  onToggleDarkMode,
  onNavigateHome,
  onNavigateLogin,
  onOpenSearch
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle modal with Shift + ? or / (when not in input)
      if (
        (e.key === '?' || (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName))) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        if (!isOpen) {
          e.preventDefault();
          onClose(true);
        }
      }

      // Close on Esc
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }

      // Quick Dark Mode toggle (Alt + D)
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        onToggleDarkMode();
      }

      // Quick Back to top (Alt + T)
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Quick Home (Alt + H)
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        onNavigateHome();
      }

      // Quick Login (Alt + L)
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        onNavigateLogin();
      }

      // Search (Ctrl + K)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (onOpenSearch) onOpenSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onToggleDarkMode, onNavigateHome, onNavigateLogin, onOpenSearch]);

  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'Ctrl + K', desc: 'Open universal case & docket search', icon: Search },
    { key: 'Alt + D', desc: 'Toggle Dark / Light visual mode', icon: Moon },
    { key: 'Alt + T', desc: 'Smooth scroll back to top of view', icon: ArrowUp },
    { key: 'Alt + H', desc: 'Navigate to Public Homepage', icon: Home },
    { key: 'Alt + L', desc: 'Open Unified Multi-Cadre Login', icon: LogIn },
    { key: '?', desc: 'Show this keyboard shortcuts cheat-sheet', icon: Keyboard },
    { key: 'Esc', desc: 'Close any open modal or review dialog', icon: X }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Power user quick access keys</p>
            </div>
          </div>
          <button
            onClick={() => onClose(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcutsList.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sc.desc}</span>
                </div>
                <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                  {sc.key}
                </kbd>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold">Esc</kbd> anytime to dismiss
        </div>

      </div>
    </div>
  );
}
