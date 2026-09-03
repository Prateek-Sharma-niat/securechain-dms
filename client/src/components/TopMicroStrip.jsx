import React from 'react';
import { Globe, Eye, Contrast, PhoneCall, Sun, Moon, Keyboard } from 'lucide-react';
import { translations } from '../i18n/translations';

/**
 * Top Micro-Strip (~30px dark navy bar #0B1220)
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
  onOpenShortcuts
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="bg-[#0B1220] text-slate-200 text-[11px] h-[30px] px-4 sm:px-8 flex items-center justify-between border-b border-slate-800 select-none z-50">
      
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

      {/* Right: Helpline, Font Scaling, High Contrast, Language Toggle */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        
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
        <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
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
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 hover:border-amber-400 transition-all cursor-pointer ml-1"
          title="Toggle Sitewide Language / भाषा बदलें"
        >
          <Globe className="w-3 h-3 text-amber-400" />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

      </div>

    </div>
  );
}
