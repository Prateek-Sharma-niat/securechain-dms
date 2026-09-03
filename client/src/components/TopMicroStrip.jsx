import React from 'react';
import { Globe, Eye, Contrast, PhoneCall, Sun, Moon, Keyboard, LogOut } from 'lucide-react';
import { translations } from '../i18n/translations';

/**
 * Top Micro-Strip (~30px dark navy bar #0B1220)
 * Placed at the very top of the page, spanning full width to the right wall.
 */
export default function TopMicroStrip({ 
  lang = 'en', 
  onToggleLang, 
  fontSizeLevel = 0, 
  onChangeFontSize, 
  highContrast = false, 
  onToggleHighContrast,
  darkMode = false,
  onToggleDarkMode,
  onOpenShortcuts,
  activeUser,
  onLogout
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="bg-[#0B1220] text-slate-200 text-[11px] h-[30px] px-3 sm:px-4 flex items-center justify-between border-b border-slate-800 select-none z-50 w-full">
      
      {/* Left: Government of India & Ministry */}
      <div className="flex items-center space-x-3 truncate">
        <span className="font-semibold text-white tracking-wider flex items-center gap-1.5">
          <span>🇮🇳</span>
          <span>{t.govtOfIndia}</span>
        </span>
        <span className="text-slate-500 hidden md:inline">|</span>
        <span className="text-slate-400 hidden lg:inline truncate">
          {t.ministryHeader}
        </span>
      </div>

      {/* Right: Controls & Rightmost Sign Out Button Touching The Wall */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
        
        {/* National Helpline */}
        <div className="hidden sm:flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
          <PhoneCall className="w-3 h-3" />
          <span>1930</span>
        </div>

        {/* Accessibility Contrast */}
        <button
          onClick={onToggleHighContrast}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toggle Contrast"
        >
          <Contrast className="w-3 h-3" />
          <span className="hidden md:inline">{highContrast ? t.contrastHigh : t.contrastStandard}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
          title={`Toggle Dark Mode (Alt+D) - Currently ${darkMode ? 'Dark' : 'Light'}`}
        >
          {darkMode ? (
            <>
              <Sun className="w-3 h-3 text-amber-400" />
              <span className="hidden lg:inline text-amber-300">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3 h-3 text-slate-400" />
              <span className="hidden lg:inline">Dark</span>
            </>
          )}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={onOpenShortcuts}
          className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-3 h-3" />
          <span className="hidden lg:inline text-[10px]">Shortcuts</span>
        </button>

        {/* Font Scaling (A- / A / A+) */}
        <div className="flex items-center space-x-1 border-l border-slate-700 pl-2 sm:pl-3">
          <button 
            onClick={() => onChangeFontSize(-1)} 
            className={`px-1 rounded hover:bg-slate-800 ${fontSizeLevel === -1 ? 'text-amber-400 font-bold' : 'text-slate-400'} cursor-pointer`}
            title="Decrease Font Size"
          >
            A-
          </button>
          <button 
            onClick={() => onChangeFontSize(0)} 
            className={`px-1 rounded hover:bg-slate-800 ${fontSizeLevel === 0 ? 'text-white font-bold' : 'text-slate-400'} cursor-pointer`}
            title="Normal Font Size"
          >
            A
          </button>
          <button 
            onClick={() => onChangeFontSize(1)} 
            className={`px-1 rounded hover:bg-slate-800 ${fontSizeLevel === 1 ? 'text-amber-400 font-bold' : 'text-slate-400'} cursor-pointer`}
            title="Increase Font Size"
          >
            A+
          </button>
        </div>

        {/* Full Bilingual Toggle Button (English <-> हिन्दी) */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
          title="Toggle Sitewide Language / भाषा बदलें"
        >
          <Globe className="w-3 h-3 text-amber-400" />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Right-most Sign Out Button: Positioned on top, touching the right-most wall */}
        {activeUser && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800/90 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 text-[11px] font-semibold transition-all cursor-pointer ml-1.5"
            title="Sign Out of Session"
          >
            <LogOut className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}

      </div>

    </div>
  );
}
