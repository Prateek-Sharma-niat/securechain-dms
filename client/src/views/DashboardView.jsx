import React, { useState } from 'react';
import { 
  Home, 
  FolderArchive, 
  FileCheck2, 
  ScrollText, 
  FileText, 
  Settings, 
  HelpCircle, 
  Plus, 
  Menu, 
  Bell,
  Shield,
  Scale,
  Microscope,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Building2,
  Lock,
  Clock,
  Database
} from 'lucide-react';
import PoliceDashboard from './dashboards/PoliceDashboard';
import JudicialDashboard from './dashboards/JudicialDashboard';
import ForensicDashboard from './dashboards/ForensicDashboard';
import AuditorDashboard from './dashboards/AuditorDashboard';
import EmptyState from '../components/EmptyState';
import { translations } from '../i18n/translations';

export default function DashboardView({ 
  documents = [], 
  metrics, 
  onSelectDocument, 
  onOpenUpload, 
  onOpenQuorum, 
  onGoToAudit,
  onGoToChain,
  activeUser,
  onSelectTab,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const role = activeUser?.portalRole || 'POLICE';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Accordion Section States
  const [expandedSections, setExpandedSections] = useState({
    cases: true,
    approvals: false,
    reports: false
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // If Auditor, directly render AuditorDashboard
  if (role === 'AUDITOR') {
    return (
      <div className="flex-1 bg-[#FFF9F2] dark:bg-slate-950 p-4 sm:p-8">
        <AuditorDashboard 
          activeUser={activeUser}
          onLogout={() => onSelectTab('home')}
          onBackToHome={() => onSelectTab('home')}
        />
      </div>
    );
  }

  // Role Theme Settings
  const getRoleTheme = () => {
    switch (role) {
      case 'POLICE':
        return {
          title: "Police / IO Dashboard",
          titleHindi: "पुलिस / जांच अधिकारी डैशबोर्ड",
          icon: Shield,
          activeBg: "bg-[#FF6A1A] text-white",
          textAccent: "text-[#FF6A1A]",
          borderAccent: "border-orange-200 dark:border-orange-800",
          tagBg: "bg-orange-100 dark:bg-orange-950 text-[#FF6A1A]"
        };
      case 'JUDICIAL':
        return {
          title: "Judicial Authority Dashboard",
          titleHindi: "न्यायिक प्राधिकरण डैशबोर्ड",
          icon: Scale,
          activeBg: "bg-[#4FA8E0] text-white",
          textAccent: "text-[#4FA8E0]",
          borderAccent: "border-sky-200 dark:border-sky-800",
          tagBg: "bg-sky-100 dark:bg-sky-950 text-[#4FA8E0]"
        };
      case 'FORENSIC':
        return {
          title: "Forensic Laboratory Dashboard",
          titleHindi: "फॉरेंसिक प्रयोगशाला डैशबोर्ड",
          icon: Microscope,
          activeBg: "bg-[#5FA777] text-white",
          textAccent: "text-[#5FA777]",
          borderAccent: "border-emerald-200 dark:border-emerald-800",
          tagBg: "bg-emerald-100 dark:bg-emerald-950 text-[#5FA777]"
        };
      default:
        return {
          title: "Case Dashboard",
          titleHindi: "प्रकरण डैशबोर्ड",
          icon: Shield,
          activeBg: "bg-[#FF6A1A] text-white",
          textAccent: "text-[#FF6A1A]",
          borderAccent: "border-orange-200 dark:border-orange-800",
          tagBg: "bg-orange-100 dark:bg-orange-950 text-[#FF6A1A]"
        };
    }
  };

  const theme = getRoleTheme();
  const HeaderIcon = theme.icon;

  return (
    <div className="flex-1 flex bg-[#FFF9F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[calc(100vh-140px)] transition-colors">
      
      {/* 1. LEFT ACCORDION SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col flex-shrink-0 select-none shadow-xs`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <HeaderIcon className={`w-4 h-4 ${theme.textAccent}`} />
              <span className="truncate">{lang === 'hi' ? theme.titleHindi : theme.title}</span>
            </div>
          ) : (
            <HeaderIcon className={`w-4 h-4 ${theme.textAccent} mx-auto`} />
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Accordion Navigation */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          
          {/* Item 1: Home Link */}
          <button
            onClick={() => onSelectTab('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{t.navHome}</span>}
          </button>

          {/* Item 2: Cases Accordion */}
          <div>
            <button
              onClick={() => toggleSection('cases')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                expandedSections.cases ? 'bg-orange-50 dark:bg-slate-800 text-[#FF6A1A]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderArchive className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>{t.navCases}</span>}
              </div>
              {sidebarOpen && (
                expandedSections.cases ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Accordion Sub-items */}
            {sidebarOpen && expandedSections.cases && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => onSelectTab('cases')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#FF6A1A] hover:bg-orange-50/50 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  {t.navAllCases}
                </button>
                <button
                  onClick={() => onSelectTab('cases')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#FF6A1A] hover:bg-orange-50/50 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  {t.navActiveCases}
                </button>
              </div>
            )}
          </div>

          {/* Item 3: Approvals Accordion */}
          <div>
            <button
              onClick={() => toggleSection('approvals')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                expandedSections.approvals ? 'bg-orange-50 dark:bg-slate-800 text-[#FF6A1A]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>{t.navApprovals}</span>}
              </div>
              {sidebarOpen && (
                <div className="flex items-center gap-1.5">
                  {metrics?.pendingQuorumCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6A1A] text-white">
                      {metrics.pendingQuorumCount}
                    </span>
                  )}
                  {expandedSections.approvals ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              )}
            </button>

            {sidebarOpen && expandedSections.approvals && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => onSelectTab('approvals')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#FF6A1A] hover:bg-orange-50/50 dark:hover:bg-slate-800 font-medium transition-colors flex items-center justify-between"
                >
                  <span>Pending Quorum</span>
                  <span className="text-[10px] text-amber-600 font-bold">{metrics?.pendingQuorumCount || 0}</span>
                </button>
              </div>
            )}
          </div>

          {/* Guidelines & Help */}
          <button
            onClick={() => onSelectTab('contact')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#FF6A1A] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>{t.navHelpAndLegal}</span>}
          </button>

        </nav>

        {/* Officer Generic Cadre Profile Badge */}
        {sidebarOpen && activeUser && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 m-2 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs">
            <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {activeUser.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {activeUser.role}
            </div>
            <div className={`text-[10px] font-mono font-bold mt-1 ${theme.textAccent}`}>
              Cadre ID: {activeUser.badge}
            </div>
          </div>
        )}

      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-orange-50 dark:bg-slate-800 border ${theme.borderAccent} flex items-center justify-center ${theme.textAccent}`}>
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {lang === 'hi' ? theme.titleHindi : theme.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Department: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.department || "National Investigation Network"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#FF6A1A] w-64"
              />
            </div>

            <button 
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.uploadBtn}</span>
            </button>
          </div>

        </div>

        {/* Dashboard Dynamic Area */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Dynamic Role Widget Panel */}
          {role === 'POLICE' ? (
            <PoliceDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenUpload={onOpenUpload}
              onOpenQuorum={onOpenQuorum}
              onGoToChain={onGoToChain}
              activeUser={activeUser}
              lang={lang}
            />
          ) : role === 'JUDICIAL' ? (
            <JudicialDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenQuorum={onOpenQuorum}
              activeUser={activeUser}
              lang={lang}
            />
          ) : role === 'FORENSIC' ? (
            <ForensicDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenUpload={onOpenUpload}
              onOpenQuorum={onOpenQuorum}
              activeUser={activeUser}
              lang={lang}
            />
          ) : (
            <PoliceDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenUpload={onOpenUpload}
              onOpenQuorum={onOpenQuorum}
              onGoToChain={onGoToChain}
              activeUser={activeUser}
              lang={lang}
            />
          )}

          {/* Section: Shared Case Records List */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {t.dashboardHeading}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dashboardSubheading}
                </p>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {t.showingCount}: <strong>{documents.length}</strong>
              </span>
            </div>

            {/* Case Cards Grid or Empty State */}
            {documents.length === 0 ? (
              <EmptyState
                title="No Legal Case Records Ingested"
                description="Begin by registering a new FIR or importing digital exhibits via the Ingest FIR button."
                actionLabel="Ingest First FIR"
                onAction={onOpenUpload}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  const isLocked = doc.status === 'LOCKED';
                  const isPending = doc.status === 'PENDING_QUORUM';

                  return (
                    <div
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#FF6A1A] dark:hover:border-[#FF6A1A] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {doc.firNo}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isLocked 
                              ? 'bg-[#5FA777]/15 text-[#307044] dark:text-emerald-400 border border-[#5FA777]/40' 
                              : isPending 
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800' 
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          }`}>
                            {isLocked ? 'LOCKED' : isPending ? 'PENDING QUORUM' : 'REJECTED'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                            {doc.caseTitle}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {doc.incidentSummary}
                          </p>
                        </div>

                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>{doc.policeStation}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">v{doc.currentVersion}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Investigating Officer: <strong className="text-slate-700 dark:text-slate-300">{doc.investigatingOfficer}</strong>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
