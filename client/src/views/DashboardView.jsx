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
  Database,
  UploadCloud,
  CheckCircle2,
  Hash,
  Activity,
  Layers,
  Award,
  PackageCheck
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
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  // Define cadre sidebar tabs
  const getSidebarTabs = () => {
    switch (role) {
      case 'POLICE':
        return [
          { id: 'overview', label: 'Executive Overview', icon: Shield, badge: null },
          { id: 'cases', label: 'Case Dockets & FIRs', icon: FolderArchive, badge: documents.length },
          { id: 'ingest', label: 'FIR & Exhibit Ingestion', icon: UploadCloud, badge: null },
          { id: 'approvals', label: 'Quorum Review Queue', icon: FileCheck2, badge: documents.filter(d => d.status === 'PENDING_QUORUM').length || null }
        ];
      case 'JUDICIAL':
        return [
          { id: 'overview', label: 'Court Scrutiny Overview', icon: Scale, badge: null },
          { id: 'dockets', label: 'Court Dockets Queue', icon: FolderArchive, badge: documents.length },
          { id: 'verify', label: 'SHA-256 Hash Verification', icon: Hash, badge: null },
          { id: 'orders', label: 'Upload Court Order', icon: UploadCloud, badge: null },
          { id: 'section65b', label: 'Section 65B Admissibility', icon: Award, badge: null },
          { id: 'approvals', label: 'Quorum Decisions', icon: FileCheck2, badge: documents.filter(d => d.status === 'PENDING_QUORUM').length || null }
        ];
      case 'FORENSIC':
        return [
          { id: 'overview', label: 'Laboratory Overview', icon: Microscope, badge: null },
          { id: 'dockets', label: 'Active Case Files', icon: FolderArchive, badge: documents.length },
          { id: 'custody', label: 'Chain of Custody Safe', icon: PackageCheck, badge: '2 Sealed' },
          { id: 'ingest', label: 'Lab Report & Extraction Ingest', icon: UploadCloud, badge: null },
          { id: 'ocr', label: 'OCR & Content Pipeline', icon: Layers, badge: '3 Ready' },
          { id: 'reviews', label: 'Technical Quorum Reviews', icon: FileCheck2, badge: documents.filter(d => d.status === 'PENDING_QUORUM').length || null }
        ];
      default:
        return [
          { id: 'overview', label: 'Overview', icon: Shield, badge: null },
          { id: 'cases', label: 'Case Records', icon: FolderArchive, badge: documents.length }
        ];
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case 'POLICE':
        return {
          title: "Police / IO Terminal",
          titleHindi: "पुलिस / जांच अधिकारी डैशबोर्ड",
          icon: Shield,
          activeBg: "bg-[#FF6A1A] text-white",
          activeTabBg: "bg-orange-50 dark:bg-orange-950/60 text-[#FF6A1A] border-l-4 border-[#FF6A1A]",
          textAccent: "text-[#FF6A1A]",
          borderAccent: "border-orange-200 dark:border-orange-800",
          tagBg: "bg-orange-100 dark:bg-orange-950 text-[#FF6A1A]"
        };
      case 'JUDICIAL':
        return {
          title: "Judicial Authority Terminal",
          titleHindi: "न्यायिक प्राधिकरण डैशबोर्ड",
          icon: Scale,
          activeBg: "bg-[#4FA8E0] text-white",
          activeTabBg: "bg-sky-50 dark:bg-sky-950/60 text-[#4FA8E0] border-l-4 border-[#4FA8E0]",
          textAccent: "text-[#4FA8E0]",
          borderAccent: "border-sky-200 dark:border-sky-800",
          tagBg: "bg-sky-100 dark:bg-sky-950 text-[#4FA8E0]"
        };
      case 'FORENSIC':
        return {
          title: "Forensic Lab Terminal",
          titleHindi: "फॉरेंसिक प्रयोगशाला डैशबोर्ड",
          icon: Microscope,
          activeBg: "bg-[#5FA777] text-white",
          activeTabBg: "bg-emerald-50 dark:bg-emerald-950/60 text-[#5FA777] border-l-4 border-[#5FA777]",
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
          activeTabBg: "bg-orange-50 dark:bg-orange-950/60 text-[#FF6A1A] border-l-4 border-[#FF6A1A]",
          textAccent: "text-[#FF6A1A]",
          borderAccent: "border-orange-200 dark:border-orange-800",
          tagBg: "bg-orange-100 dark:bg-orange-950 text-[#FF6A1A]"
        };
    }
  };

  const theme = getRoleTheme();
  const HeaderIcon = theme.icon;
  const sidebarTabs = getSidebarTabs();

  // Filtered documents for case registry
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.firNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.incidentSummary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && doc.status === statusFilter;
  });

  return (
    <div className="flex-1 flex bg-[#FFF9F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[calc(100vh-140px)] transition-colors">
      
      {/* 1. LEFT CADRE-AWARE SIDEBAR */}
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

        {/* Dynamic Cadre Navigation Tabs */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? theme.activeTabBg 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={tab.label}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? theme.textAccent : 'text-slate-400'}`} />
                  {sidebarOpen && <span className="truncate">{tab.label}</span>}
                </div>

                {sidebarOpen && tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    typeof tab.badge === 'number'
                      ? 'bg-orange-100 dark:bg-orange-950 text-[#FF6A1A]'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Officer Cadre Profile Badge */}
        {sidebarOpen && activeUser && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 m-2 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs">
            <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {activeUser.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {activeUser.role}
            </div>
            <div className={`text-[10px] font-mono font-bold mt-1 ${theme.textAccent}`}>
              ID: {activeUser.badge}
            </div>
          </div>
        )}

      </aside>

      {/* 2. MAIN FOCUSED CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-orange-50 dark:bg-slate-800 border ${theme.borderAccent} flex items-center justify-center ${theme.textAccent}`}>
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {sidebarTabs.find(t => t.id === activeSidebarTab)?.label || theme.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Cadre: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Station: <span className={theme.textAccent}>{activeUser?.policeStation || activeUser?.court || activeUser?.labUnit || "HQ Terminal"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ingest Docket</span>
            </button>
          </div>

        </div>

        {/* Content Body: Only render the single active view */}
        <div className="p-6 sm:p-8 flex-1">
          
          {/* VIEW: CASE DOCKETS & REGISTRY (RENDERED ONLY WHEN CASES/DOCKETS IS SELECTED) */}
          {(activeSidebarTab === 'cases' || activeSidebarTab === 'dockets') ? (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Sealed Legal Dockets Registry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Search and inspect cryptographically anchored FIR dockets and evidence chains
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search FIR no, title or keyword..."
                      className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#FF6A1A] w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['ALL', 'LOCKED', 'PENDING_QUORUM'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          statusFilter === status 
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {status === 'ALL' ? 'All' : status === 'LOCKED' ? 'Locked' : 'Pending'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cards Grid or Empty State */}
              {filteredDocs.length === 0 ? (
                <EmptyState
                  title="No Matching Dockets Found"
                  description="Try adjusting your search criteria or register a new FIR docket into the repository."
                  actionLabel="Ingest First FIR"
                  onAction={onOpenUpload}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocs.map((doc) => {
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
          ) : role === 'POLICE' ? (
            <PoliceDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenUpload={onOpenUpload}
              onOpenQuorum={onOpenQuorum}
              onGoToChain={onGoToChain}
              activeUser={activeUser}
              activeTab={activeSidebarTab}
              lang={lang}
            />
          ) : role === 'JUDICIAL' ? (
            <JudicialDashboard
              documents={documents}
              metrics={metrics}
              onSelectDocument={onSelectDocument}
              onOpenQuorum={onOpenQuorum}
              activeUser={activeUser}
              activeTab={activeSidebarTab}
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
              activeTab={activeSidebarTab}
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
              activeTab={activeSidebarTab}
              lang={lang}
            />
          )}

        </div>

      </div>

    </div>
  );
}
