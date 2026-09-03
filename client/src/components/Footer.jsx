import React from 'react';
import { translations } from '../i18n/translations';

/**
 * Official Government Footer (Light Background #FFFFFF)
 * Policy links row, NIC/MHA attribution, and thin tricolor bottom border per master spec.
 */
export default function Footer({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs select-none">
      
      {/* 1. Policy Links Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-xs font-medium border-b border-slate-100 pb-4">
          <a href="#privacy" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyPrivacy}</a>
          <span className="text-slate-300">|</span>
          <a href="#terms" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyTerms}</a>
          <span className="text-slate-300">|</span>
          <a href="#hyperlink" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyHyperlink}</a>
          <span className="text-slate-300">|</span>
          <a href="#copyright" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyCopyright}</a>
          <span className="text-slate-300">|</span>
          <a href="#accessibility" className="hover:text-[#FF6A1A] transition-colors">{t.footerPolicyAccessibility}</a>
        </div>

        {/* 2. Attribution & Hosting */}
        <div className="text-center pt-4 space-y-1 text-slate-500 text-[11px]">
          <p>
            {t.footerManagedBy}
          </p>
          <p>
            {t.footerHostedBy}
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            SecureChain DMS Version 2.4 • CrPC Section 154 / BSA Section 63 Compliant
          </p>
        </div>
      </div>

      {/* 3. Thin Tricolor Bottom Border */}
      <div className="w-full h-[5px] flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-[#FFFFFF]"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

    </footer>
  );
}
