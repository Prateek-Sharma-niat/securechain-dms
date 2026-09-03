import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  Shield, 
  Scale, 
  PhoneCall, 
  FileText, 
  CheckCircle2, 
  Globe,
  Award,
  Lock
} from 'lucide-react';
import { translations } from '../i18n/translations';

/**
 * Official Government Footer (Light & Dark Theme)
 * Complete with multi-column ministry links, statutory compliance, GIGW 3.0 standards,
 * emergency hotlines, and national tricolor bottom border.
 */
export default function Footer({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs select-none transition-colors">
      
      {/* 1. National Helpline Micro-Bar */}
      <div className="bg-[#FFF3E6] dark:bg-slate-950 border-b border-orange-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse"></span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              National Emergency & Citizen Assistance Directory:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Emergency: <strong>112</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Cyber Financial Fraud: <strong>1930</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Women Helpline: <strong>1090</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Free Legal Aid (NALSA): <strong>15100</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Column Government Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          
          {/* Column 1: MHA & Lead Agency */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Government of India
              </h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              <strong>Ministry of Home Affairs (MHA)</strong><br />
              North Block, Central Secretariat,<br />
              New Delhi, Delhi 110001, India
            </p>
            <div className="text-[11px] space-y-1 text-slate-500 dark:text-slate-400 pt-1">
              <div>Portal: <a href="https://mha.gov.in" target="_blank" rel="noreferrer" className="text-[#FF6A1A] hover:underline">mha.gov.in</a></div>
              <div>National Portal: <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="text-[#FF6A1A] hover:underline">india.gov.in</a></div>
            </div>
          </div>

          {/* Column 2: Interoperable Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF6A1A]" />
              <span>Related Official Portals</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="https://ncrb.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] flex items-center justify-between group">
                  <span>National Crime Records Bureau (NCRB)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FF6A1A]" />
                </a>
              </li>
              <li>
                <a href="https://ecourts.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] flex items-center justify-between group">
                  <span>eCourts Services Mission Mode Project</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FF6A1A]" />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] flex items-center justify-between group">
                  <span>National Cyber Crime Reporting Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FF6A1A]" />
                </a>
              </li>
              <li>
                <a href="https://doj.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] flex items-center justify-between group">
                  <span>Department of Justice (DoJ)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FF6A1A]" />
                </a>
              </li>
              <li>
                <a href="https://dfs.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] flex items-center justify-between group">
                  <span>Directorate of Forensic Science Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FF6A1A]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Criminal Acts */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-600" />
              <span>Statutory Legal Framework</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-slate-700 dark:text-slate-300 font-medium">
                Bharatiya Sakshya Adhiniyam (BSA), 2023
                <span className="block text-[10px] text-slate-400 font-normal">Section 63 (Electronic Evidence Admissibility)</span>
              </li>
              <li className="text-slate-700 dark:text-slate-300 font-medium">
                Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
                <span className="block text-[10px] text-slate-400 font-normal">Section 173 (Information in Cognizable Cases & e-FIR)</span>
              </li>
              <li className="text-slate-700 dark:text-slate-300 font-medium">
                Bharatiya Nyaya Sanhita (BNS), 2023
                <span className="block text-[10px] text-slate-400 font-normal">Substantive Penal Provisions & Evidence Preservation</span>
              </li>
              <li className="text-slate-700 dark:text-slate-300 font-medium">
                Information Technology Act, 2000
                <span className="block text-[10px] text-slate-400 font-normal">Section 65B & Section 79A Examiner Certification</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Accessibility */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standards & Compliance</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GIGW 3.0 Certified</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Compliant with Guidelines for Indian Government Websites & WCAG 2.1 Level AA.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>ISO/IEC 27037:2012</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Guidelines for identification, collection, acquisition and preservation of digital evidence.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Mandatory Policy Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 dark:text-slate-400 text-xs font-medium py-5 border-b border-slate-100 dark:border-slate-800">
          <a href="#terms" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyTerms}</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#privacy" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyPrivacy}</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#hyperlink" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyHyperlink}</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#copyright" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyCopyright}</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#accessibility" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyAccessibility}</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] transition-colors">CPGRAMS Grievance Portal</a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="https://rtionline.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF6A1A] transition-colors">RTI Online</a>
        </div>

        {/* 4. Attribution & Sovereign Hosting */}
        <div className="text-center pt-5 space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <p>
            Website Content Managed by <strong>Ministry of Home Affairs, Government of India</strong>
          </p>
          <p>
            Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>, Ministry of Electronics & Information Technology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[10px] text-slate-400 font-mono">
            <span>SecureChain DMS Release 2.4.0</span>
            <span>•</span>
            <span>Last Reviewed & Updated: <strong>03-Sep-2026</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">256-Bit HSM Sovereign Vault Active</span>
          </div>
        </div>
      </div>

      {/* 5. Indian Tricolor Bottom Border */}
      <div className="w-full h-[6px] flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-[#FFFFFF]"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

    </footer>
  );
}
