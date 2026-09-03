import React, { useState } from 'react';
import { 
  Shield, 
  Scale, 
  Microscope, 
  ArrowRight, 
  Lock, 
  FileCheck2, 
  CheckCircle2, 
  Bell, 
  AlertTriangle,
  FolderArchive,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  UserCheck,
  Building2,
  FileText,
  FileSearch,
  Database,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function LandingPage({ 
  onGoToLogin, 
  onGoToCitizen,
  activeUser, 
  metrics,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const [hoveredStat, setHoveredStat] = useState(null);

  const tickerAdvisories = [
    "National Advisory: All electronic FIRs filed under CrPC §154 / BNSS §173 are sealed with cryptographic SHA-256 integrity.",
    "Judicial Standard: Electronic records are certified admissible under Section 65B Indian Evidence Act / Section 63 BSA 2023.",
    "Integrity Sentinel: Any supplementary modification requires mandatory 2-of-3 independent multi-cadre officer consensus.",
    "Citizen Desk: Helpline 1930 is operational 24x7 for cyber crime reporting and complaint assistance."
  ];

  const statItems = [
    {
      id: 'firs',
      label: lang === 'hi' ? 'सील किए गए केस' : 'Sealed Legal Dockets',
      val: metrics?.totalDocuments ? `${metrics.totalDocuments} FIRs` : '100% Sealed',
      sub: lang === 'hi' ? 'शून्य अनधिकृत फेरबदल' : 'Zero unapproved alterations',
      icon: Shield,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
      hoverDetail: 'Every registered FIR is immutable under Ministry of Home Affairs evidentiary standards.'
    },
    {
      id: 'blocks',
      label: lang === 'hi' ? 'क्रिप्टोग्राफिक ब्लॉक्स' : 'Chained Proof Blocks',
      val: metrics?.totalBlocks ? `${metrics.totalBlocks} Blocks` : '14 Blocks',
      sub: lang === 'hi' ? 'परस्पर जुड़े SHA-256 हैश' : 'Interlinked SHA-256 Merkle chain',
      icon: Database,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
      hoverDetail: 'Each block cryptographically references its predecessor for mathematical tamper proofing.'
    },
    {
      id: 'quorum',
      label: lang === 'hi' ? 'बहु-अधिकारी सत्यापन' : 'Multi-Cadre Reviews',
      val: '2-of-3 Quorum',
      sub: lang === 'hi' ? 'स्वतंत्र 3-अधिकारी समीक्षा' : 'Strict separation of powers',
      icon: FileCheck2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      hoverDetail: 'No individual officer can approve their own record amendment without peer consensus.'
    },
    {
      id: 'compliance',
      label: lang === 'hi' ? 'न्यायालयीन अनुपालन' : 'Court Admissibility',
      val: 'BSA §63 / 65B',
      sub: lang === 'hi' ? 'स्वतः इलेक्ट्रॉनिक प्रमाणपत्र' : 'Automated forensic audit certificate',
      icon: Scale,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900',
      hoverDetail: 'High-court approved evidentiary chain-of-custody format for swift judicial prosecution.'
    }
  ];

  return (
    <div className="bg-[#FFF9F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex-1 flex flex-col transition-colors">
      
      {/* 1. What's New Ticker Strip */}
      <div className="bg-[#FFF3E6] dark:bg-slate-900/80 border-b border-orange-200/80 dark:border-slate-800 px-4 sm:px-8 py-2 text-xs flex items-center space-x-3 overflow-hidden select-none">
        <div className="flex items-center gap-1.5 font-bold text-[#FF6A1A] uppercase tracking-wider flex-shrink-0 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-orange-300 dark:border-orange-800/60 shadow-xs">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>{lang === 'hi' ? 'ताज़ा सूचना' : "What's New"}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium text-xs">
          <div className="inline-block animate-marquee pl-4">
            {tickerAdvisories.join("   ✦   ")}
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-14 pb-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800/80 text-[#FF6A1A] text-xs font-bold shadow-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>National Electronic Docket Custody Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Cryptographic Integrity for <br className="hidden sm:inline" />
            <span className="text-[#FF6A1A]">Police Records & Legal Evidence</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SecureChain DMS establishes an unbreakable digital chain of custody for FIRs, forensic exhibits, and judicial records. Sealed at inception, mathematically tamper-evident, and accessible for direct citizen tracking.
          </p>

          {/* Primary Action Buttons: Citizen Tracking vs Official Sign In */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={onGoToCitizen}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8C42] hover:from-[#E85B0E] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Check Crime Record & Complaint Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onGoToLogin('POLICE')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#FF6A1A]" />
              <span>Official Cadre Sign In</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            Citizens can track complaint status using registered mobile or FIR acknowledgement number with zero technical friction.
          </p>

        </div>
      </section>

      {/* 3. Interactive Hover Stats */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            const isHovered = hoveredStat === stat.id;
            return (
              <div
                key={stat.id}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`relative bg-white dark:bg-slate-900 border rounded-3xl p-5 transition-all duration-200 cursor-default select-none group ${
                  isHovered
                    ? 'border-orange-300 dark:border-orange-500/60 shadow-xl -translate-y-1.5'
                    : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {stat.val}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {stat.sub}
                  </div>
                </div>

                {/* Micro hover insight tooltip */}
                <div className={`mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] leading-relaxed transition-all ${
                  isHovered 
                    ? 'text-orange-600 dark:text-orange-400 font-medium' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {stat.hoverDetail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Core Features Showcase (Replacing cluttered login boxes) */}
      <section className="px-4 sm:px-8 py-12 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 mt-6 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-200 dark:border-orange-800">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Features Built for Indian Jurisprudence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Engineered to meet statutory evidentiary standards under Bharatiya Nagarik Suraksha Sanhita (BNSS) and Bharatiya Sakshya Adhiniyam (BSA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            {/* Feature 1 */}
            <div className="bg-[#FFF9F2] dark:bg-slate-900 border border-orange-200/70 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-orange-400 transition-colors shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Pre-Lock OCR Review
                </h3>
                <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider">
                  Human-in-the-Loop
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Scanned documents are analyzed with character-level confidence heatmapping. Hashes are sealed strictly upon human verification, preventing OCR noise from polluting legal dockets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F4F9FD] dark:bg-slate-900 border border-sky-200/70 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-sky-400 transition-colors shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cryptographic Versioning
                </h3>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                  Zero Silent Overwrites
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Original FIR dockets remain permanently pristine. Any supplementary charge-sheet or forensic addendum creates a cryptographically linked child version with full lineage.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F4FAF6] dark:bg-slate-900 border border-emerald-200/70 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-400 transition-colors shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  M-of-N Quorum Reviews
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Decentralized Consensus
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Proposed docket modifications require 2-of-3 independent approvals from peer officers. Automatic conflict-of-interest enforcement prevents investigators from approving their own filings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8F5FF] dark:bg-slate-900 border border-purple-200/70 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-purple-400 transition-colors shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Section 65B Generator
                </h3>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  Judicial Admissibility
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Generates instant legal certificates conforming to Section 65B of Indian Evidence Act / Section 63 BSA 2023 with verified device hashes, officer attestations, and court seals.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Citizen Empowerment & Transparency */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full space-y-6">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-900 border border-orange-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-200 dark:border-orange-800">
              Direct Citizen Access
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Check Your Case & Complaint Status Anytime
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No legal jargon, complex hash codes, or official credentials required. Simply verify your 10-digit registered mobile number or enter your FIR acknowledgement number to see plain-language investigation updates.
            </p>
            <div className="pt-2">
              <button
                onClick={onGoToCitizen}
                className="px-6 py-3 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Access Citizen Tracking Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Sample Docket Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Under Investigation
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">FIR No: 0842/2024</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Special Investigation PS, New Delhi</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Evidence locked under WORM cryptographic seal</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
