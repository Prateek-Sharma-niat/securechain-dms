import React, { useState, useEffect } from 'react';
import TopMicroStrip from './components/TopMicroStrip';
import MainHeader from './components/MainHeader';
import FlagBanner from './components/FlagBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleLoginModal from './components/RoleLoginModal';
import UploadModal from './components/UploadModal';
import QuorumModal from './components/QuorumModal';
import ShortcutsModal from './components/ShortcutsModal';
import BackToTop from './components/BackToTop';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import DashboardView from './views/DashboardView';
import AuditorDashboard from './views/dashboards/AuditorDashboard';
import CitizenPortalView from './views/CitizenPortalView';
import DocumentDetailView from './views/DocumentDetailView';
import VersionChainView from './views/VersionChainView';
import AuditLogView from './views/AuditLogView';
import ContactView from './views/ContactView';
import { ToastProvider, useToast } from './context/ToastContext';
import { translations } from './i18n/translations';

function AppContent() {
  const toast = useToast();

  // Global Bilingual Internationalization State (English / हिन्दी)
  const [lang, setLang] = useState('en');
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Shortcuts Modal State
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // App Navigation & Active View State
  const [currentTab, setCurrentTab] = useState('home'); // home | dashboard | cases | approvals | audit | contact | citizen | login
  const [loginRoleIntent, setLoginRoleIntent] = useState('POLICE');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewingChain, setIsViewingChain] = useState(false);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [quorumModalOpen, setQuorumModalOpen] = useState(false);
  const [activeQuorumDoc, setActiveQuorumDoc] = useState(null);

  // Data & Authentication
  const [personas, setPersonas] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [metrics, setMetrics] = useState({
    totalDocuments: 3,
    lockedCount: 2,
    pendingQuorumCount: 1,
    rejectedCount: 0,
    totalBlocks: 4
  });
  const [loading, setLoading] = useState(true);

  // Apply dark mode class to <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle dark mode (Alt + D)
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setDarkMode(prev => !prev);
      }
      // Toggle Shortcuts (Shift + / or ?)
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      }
      // Go to Home (Alt + H)
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setCurrentTab('home');
        setSelectedDoc(null);
      }
      // Go to Citizen Portal (Alt + C)
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setCurrentTab('citizen');
      }
      // Escape closes modals
      if (e.key === 'Escape') {
        setShortcutsOpen(false);
        setUploadModalOpen(false);
        setQuorumModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial data from backend
  const fetchAllData = async () => {
    try {
      // Fetch personas
      const pRes = await fetch('/api/personas');
      if (pRes.ok) {
        const pData = await pRes.json();
        setPersonas(pData.personas || []);
      }

      // Fetch documents & metrics
      const dRes = await fetch('/api/documents');
      if (dRes.ok) {
        const dData = await dRes.json();
        setDocuments(dData.documents || []);
        if (dData.metrics) setMetrics(dData.metrics);
        
        if (selectedDoc) {
          const fresh = dData.documents.find(d => d.id === selectedDoc.id);
          if (fresh) setSelectedDoc(fresh);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers
  const handleToggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleChangeFontSize = (delta) => {
    setFontSizeLevel(delta);
  };

  const handleToggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const handleSelectTab = (tabId) => {
    // Audit Log access control: ONLY AUDITORS can view WORM Audit Vault
    if (tabId === 'audit') {
      if (activeUser?.portalRole !== 'AUDITOR') {
        toast.warning("Access Restricted: The WORM Cryptographic Ledger is exclusively accessible by certified Ministry of Home Affairs Auditors.");
        return;
      }
    }

    // Dashboard access control: if user clicks dashboard without logging in, route to login
    if (tabId === 'dashboard' && !activeUser) {
      setLoginRoleIntent('POLICE');
      setCurrentTab('login');
      return;
    }

    setCurrentTab(tabId);
    setSelectedDoc(null);
    setIsViewingChain(false);
  };

  const handleSelectDocument = (doc) => {
    setSelectedDoc(doc);
    setIsViewingChain(false);
  };

  const handleGoToChain = (doc) => {
    setSelectedDoc(doc);
    setIsViewingChain(true);
  };

  const handleOpenQuorum = (doc) => {
    setActiveQuorumDoc(doc);
    setQuorumModalOpen(true);
  };

  const handleOpenRoleLogin = (roleKey) => {
    setLoginRoleIntent(roleKey || 'POLICE');
    setCurrentTab('login');
  };

  const handleSwitchPersona = (persona) => {
    setActiveUser(persona);
    toast.info(`Switched active cadre to ${persona.name} (${persona.role})`);
  };

  const handleSwitchUserById = (userId) => {
    const p = personas.find(item => item.id === userId);
    if (p) {
      setActiveUser(p);
      toast.info(`Acting as ${p.name}`);
    }
  };

  const handleLoginSuccess = (user) => {
    setActiveUser(user);
    toast.success(`Authenticated successfully as ${user.name}`);
    if (user.portalRole === 'AUDITOR') {
      setCurrentTab('audit');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setCurrentTab('home');
    setSelectedDoc(null);
    toast.info("Logged out of official session.");
  };

  const handleRequestEdit = async (docId, editData) => {
    try {
      const res = await fetch(`/api/documents/${docId}/request-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editData,
          requesterId: activeUser?.id || 'POL-DL-4892'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request edit');

      await fetchAllData();
      setSelectedDoc(data.document);
      setActiveQuorumDoc(data.document);
      setQuorumModalOpen(true);
      toast.success("Amendment submitted for multi-officer consensus!");
    } catch (err) {
      toast.error("Error submitting edit request: " + err.message);
    }
  };

  const handleVoteSuccess = (updatedDoc, updatedSession) => {
    setSelectedDoc(updatedDoc);
    if (activeQuorumDoc?.id === updatedDoc.id) {
      setActiveQuorumDoc(updatedDoc);
    }
    fetchAllData();
    toast.success("Consensus vote recorded on immutable ledger.");
  };

  const handleUploadSuccess = (newDoc) => {
    fetchAllData();
    setSelectedDoc(newDoc);
    setCurrentTab('dashboard');
    toast.success(`FIR ${newDoc.firNo} sealed into tamper-evident repository!`);
  };

  // Dynamic font scaling
  const fontScaleClass = 
    fontSizeLevel === 1 ? 'text-[115%]' : 
    fontSizeLevel === -1 ? 'text-[90%]' : '';

  const t = translations[lang] || translations.en;

  return (
    <div className={`min-h-screen flex flex-col bg-[#FFF9F2] dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${highContrast ? 'contrast-125' : ''} ${fontScaleClass}`}>
      
      {/* 1. Top Micro-Strip with Dark Mode Toggle & Shortcut Triggers */}
      <TopMicroStrip
        lang={lang}
        onToggleLang={handleToggleLang}
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={handleChangeFontSize}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(prev => {
            const next = !prev;
            if (next) {
              document.documentElement.classList.add('dark');
              localStorage.setItem('theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('theme', 'light');
            }
            return next;
          });
        }}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* 2. Main Header */}
      <MainHeader lang={lang} />

      {/* 3. Primary Navbar */}
      <Navbar
        currentTab={selectedDoc || isViewingChain ? 'cases' : currentTab}
        onSelectTab={handleSelectTab}
        activeUser={activeUser}
        onOpenLogin={handleOpenRoleLogin}
        onLogout={handleLogout}
        personas={personas}
        onSwitchPersona={handleSwitchPersona}
        onOpenUpload={() => setUploadModalOpen(true)}
        lang={lang}
      />

      {/* 4. Indian Flag Banner */}
      <FlagBanner />

      {/* 5. Main Content Area */}
      <main className="flex-1 flex flex-col">
        
        {/* Dedicated Login View */}
        {currentTab === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentTab('home')}
            initialRole={loginRoleIntent}
          />
        ) : selectedDoc && !isViewingChain ? (
          /* Real Indian FIR Document Viewer */
          <DocumentDetailView
            document={selectedDoc}
            allDocuments={documents}
            onSelectDocument={handleSelectDocument}
            onRequestEdit={handleRequestEdit}
            onOpenQuorum={handleOpenQuorum}
            activeUser={activeUser}
            onBackToDashboard={() => setSelectedDoc(null)}
            lang={lang}
          />
        ) : isViewingChain ? (
          /* Version Chain & Lineage Comparison View */
          <VersionChainView
            document={selectedDoc || documents[1] || documents[0]}
            onBack={() => setIsViewingChain(false)}
            allDocuments={documents}
            onSelectDocument={handleSelectDocument}
            lang={lang}
          />
        ) : currentTab === 'home' ? (
          /* Public Homepage / Feature Showcase */
          <LandingPage
            onOpenRoleLogin={handleOpenRoleLogin}
            onGoToDashboard={() => {
              if (!activeUser) {
                handleOpenRoleLogin('POLICE');
              } else {
                handleSelectTab('dashboard');
              }
            }}
            onGoToCitizen={() => handleSelectTab('citizen')}
            activeUser={activeUser}
            metrics={metrics}
            lang={lang}
          />
        ) : currentTab === 'citizen' ? (
          /* Citizen Record Portal */
          <CitizenPortalView
            lang={lang}
            onBackToHome={() => handleSelectTab('home')}
          />
        ) : currentTab === 'dashboard' || currentTab === 'cases' ? (
          /* Role-Based Dashboard View */
          <DashboardView
            documents={documents}
            metrics={metrics}
            onSelectDocument={handleSelectDocument}
            onOpenUpload={() => setUploadModalOpen(true)}
            onOpenQuorum={handleOpenQuorum}
            onGoToAudit={() => handleSelectTab('audit')}
            onGoToChain={handleGoToChain}
            activeUser={activeUser}
            onSelectTab={handleSelectTab}
            lang={lang}
          />
        ) : currentTab === 'approvals' ? (
          /* Quorum Approvals Queue */
          <div className="flex-1 bg-[#FFF9F2] dark:bg-slate-950 p-6 sm:p-12 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-200 dark:border-orange-800">
                    M-of-N Consensus Board
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                    {lang === 'hi' ? 'लंबित कोरम अनुमोदन कतार' : 'Pending Quorum Approvals (Independent Review)'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? '2-से-3 अधिकारियों की औपचारिक सहमति हेतु प्रस्तुत संशोधन' : 'Supplementary amendments requiring 2-of-3 supervisory validation before committing'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-300 dark:border-amber-800">
                  {metrics.pendingQuorumCount} Active Session
                </span>
              </div>

              {documents.filter(d => d.status === 'PENDING_QUORUM').map(doc => (
                <div key={doc.id} className="bg-white dark:bg-slate-900 border-2 border-orange-300 dark:border-orange-700/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{doc.firNo}</span>
                      <span className="text-xs text-[#FF6A1A] font-bold">Draft Version {doc.draftVersion || '1.1'}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{doc.caseTitle}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{doc.incidentSummary}</p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Investigating Officer: <strong className="text-slate-800 dark:text-slate-200">{doc.investigatingOfficer}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenQuorum(doc)}
                    className="px-5 py-3 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <span>Enter Approval Review</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : currentTab === 'audit' ? (
          /* WORM Audit Log View - Restricted to Auditor */
          activeUser?.portalRole === 'AUDITOR' ? (
            <AuditorDashboard 
              activeUser={activeUser}
              onLogout={handleLogout}
              onBackToHome={() => setCurrentTab('home')}
            />
          ) : (
            <div className="flex-1 bg-[#FFF9F2] dark:bg-slate-950 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Access Restricted</h2>
              <p className="text-xs text-slate-500 max-w-md">
                The WORM Audit Ledger is restricted to authenticated Ministry of Home Affairs Auditors. Please sign in with an Auditor Cadre ID.
              </p>
              <button
                onClick={() => handleOpenRoleLogin('AUDITOR')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs"
              >
                Sign In as Auditor
              </button>
            </div>
          )
        ) : currentTab === 'contact' ? (
          /* Legal Directory & Helpdesk */
          <ContactView lang={lang} />
        ) : null}

      </main>

      {/* 6. Official Government Footer */}
      <Footer lang={lang} />

      {/* Floating Back To Top Button */}
      <BackToTop />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* ================= MODALS ================= */}

      {/* + New Document Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        activeUser={activeUser}
        lang={lang}
      />

      {/* M-of-N Quorum Modal */}
      {activeQuorumDoc && (
        <QuorumModal
          isOpen={quorumModalOpen}
          onClose={() => setQuorumModalOpen(false)}
          document={activeQuorumDoc}
          activeUser={activeUser}
          onVoteSuccess={handleVoteSuccess}
          onSwitchUser={handleSwitchUserById}
          lang={lang}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
