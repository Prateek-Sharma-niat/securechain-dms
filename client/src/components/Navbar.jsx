import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  FolderArchive, 
  UploadCloud, 
  FileCheck2, 
  ScrollText, 
  HelpCircle, 
  ChevronDown, 
  LogOut, 
  User, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  BookOpen, 
  FileText,
  Lock,
  Layers,
  Scale,
  Microscope,
  FileCheck
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function Navbar({ 
  currentTab, 
  onSelectTab, 
  activeUser, 
  onOpenLogin, 
  onLogout, 
  personas = [], 
  onSwitchPersona, 
  onOpenUpload,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  
  const [casesMenuOpen, setCasesMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  const casesRef = useRef(null);
  const helpRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (casesRef.current && !casesRef.current.contains(event.target)) setCasesMenuOpen(false);
      if (helpRef.current && !helpRef.current.contains(event.target)) setHelpMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleDotColor = (role) => {
    switch (role) {
      case 'POLICE': return 'bg-[#FF6A1A]';
      case 'JUDICIAL': return 'bg-[#4FA8E0]';
      case 'FORENSIC': return 'bg-[#5FA777]';
      case 'AUDITOR': return 'bg-purple-600';
      case 'CITIZEN': return 'bg-slate-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-[54px]">
        
        {/* Left: Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          
          {/* 1. Home */}
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#FF6A1A] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#FF6A1A] dark:hover:text-[#FF6A1A] hover:bg-orange-50/70 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.navHome}</span>
          </button>

          {/* 2. Cadre Dashboard (Only if logged in) */}
          {activeUser && (
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#FF6A1A] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#FF6A1A] dark:hover:text-[#FF6A1A] hover:bg-orange-50/70 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.navDashboard}</span>
            </button>
          )}

          {/* 3. Cases & Evidence Dropdown (For Official Cadres) */}
          {activeUser && activeUser.portalRole !== 'CITIZEN' && (
            <div className="relative" ref={casesRef}>
              <button
                onClick={() => setCasesMenuOpen(!casesMenuOpen)}
                onMouseEnter={() => setCasesMenuOpen(true)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'cases' || casesMenuOpen
                    ? 'text-[#FF6A1A] bg-orange-50 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#FF6A1A] hover:bg-orange-50/70 dark:hover:bg-slate-800'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>{t.navCases}</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {casesMenuOpen && (
                <div 
                  onMouseLeave={() => setCasesMenuOpen(false)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider border-b border-slate-100 dark:border-slate-800">
                    {t.navCases}
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => { onSelectTab('cases'); setCasesMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>{t.navAllCases}</span>
                      <span className="text-[10px] font-mono text-slate-400">All FIRs</span>
                    </button>
                    <button
                      onClick={() => { onSelectTab('cases'); setCasesMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors"
                    >
                      {t.navActiveCases}
                    </button>
                    <button
                      onClick={() => { onSelectTab('approvals'); setCasesMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>{t.navPendingReviews}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Quorum Approvals (Police, Judicial, Forensic) */}
          {activeUser && activeUser.portalRole !== 'CITIZEN' && activeUser.portalRole !== 'AUDITOR' && (
            <button
              onClick={() => onSelectTab('approvals')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'approvals'
                  ? 'bg-[#FF6A1A] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#FF6A1A] hover:bg-orange-50/70 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{t.navApprovals}</span>
            </button>
          )}

          {/* 5. AUDITOR-ONLY TAB: WORM Audit Vault */}
          {activeUser?.portalRole === 'AUDITOR' && (
            <button
              onClick={() => onSelectTab('audit')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'audit'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5 text-purple-500 dark:text-purple-300" />
              <span>WORM Audit Vault</span>
            </button>
          )}

          {/* 6. Citizen Tracking Link */}
          <button
            onClick={() => onSelectTab('citizen')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'citizen'
                ? 'bg-[#7B93AD] text-white shadow-sm'
                : 'text-[#57728E] dark:text-slate-300 hover:text-[#38536E] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.navTrackRecords}</span>
          </button>

          {/* 7. Legal & Guidelines Dropdown */}
          <div className="relative" ref={helpRef}>
            <button
              onClick={() => setHelpMenuOpen(!helpMenuOpen)}
              onMouseEnter={() => setHelpMenuOpen(true)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentTab === 'contact' || helpMenuOpen
                  ? 'text-[#FF6A1A] bg-orange-50 dark:bg-slate-800'
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#FF6A1A] hover:bg-orange-50/70 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navHelpAndLegal}</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {helpMenuOpen && (
              <div 
                onMouseLeave={() => setHelpMenuOpen(false)}
                className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider border-b border-slate-100 dark:border-slate-800">
                  {t.navHelpAndLegal}
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => { onSelectTab('home'); setHelpMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navAbout}</span>
                  </button>
                  <button
                    onClick={() => { onSelectTab('contact'); setHelpMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navLegalActs}</span>
                  </button>
                  <button
                    onClick={() => { onSelectTab('citizen'); setHelpMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navCitizenHelp}</span>
                  </button>
                  <button
                    onClick={() => { onSelectTab('contact'); setHelpMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] rounded-xl transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navContact}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Authenticated Cadre Display & Direct Sign Out */}
        <div className="flex items-center space-x-2.5">
          
          {activeUser ? (
            <div className="flex items-center gap-2">
              {/* Authenticated Officer Identifier (Locked to detected role) */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <div className={`w-2.5 h-2.5 rounded-full ${getRoleDotColor(activeUser.portalRole)}`}></div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {activeUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-mono">
                    {activeUser.badge || activeUser.role}
                  </div>
                </div>
              </div>

              {/* Subtle Sign Out Button */}
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLogin('POLICE')}
              className="px-4 py-1.5 rounded-xl bg-[#FF6A1A] hover:bg-[#e85b0e] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Official Sign In</span>
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}
