import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { translations } from '../i18n/translations';

/**
 * Official Guidelines & Nodal Helpdesk Directory (Light Background)
 */
export default function ContactView({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const contacts = [
    {
      unit: "Ministry of Home Affairs (MHA)",
      division: "Investigation & Records Custody Division",
      location: "North Block, Central Secretariat, New Delhi - 110001",
      phone: "011-23092011 / 1930",
      email: "custody-support@mha.gov.in",
      role: "Central Policy & Cryptographic Oversight"
    },
    {
      unit: "Patiala House Courts Special Registry",
      division: "Electronic Evidence Authentication Registry",
      location: "India Gate Circle, New Delhi - 110001",
      phone: "011-23384210",
      email: "registry-phc@delhicourts.nic.in",
      role: "Section 65B BSA Certified Admissibility"
    },
    {
      unit: "Central Forensic Science Laboratory (CFSL)",
      division: "Digital & Hardware Evidence Division",
      location: "Block IV, CGO Complex, Lodhi Road, New Delhi - 110003",
      phone: "011-24361280",
      email: "cfsl-evidence@cbi.gov.in",
      role: "Laboratory Examination & Hash Sealing"
    }
  ];

  return (
    <div className="flex-1 bg-[#FFF9F2] p-4 sm:p-8 flex flex-col items-center select-none min-h-[calc(100vh-140px)]">
      <div className="max-w-5xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-[#FF6A1A] border border-orange-200">
            Official Directory
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            {lang === 'hi' ? 'कानूनी अधिनियम एवं नोडल संपर्क निर्देशिका' : 'Statutory Guidelines & Nodal Authority Directory'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official contact points for electronic evidence verification and court certificate queries.
          </p>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.unit}</h3>
                <span className="text-[10px] text-[#FF6A1A] font-semibold">{c.division}</span>
              </div>
              <p className="text-xs text-slate-600">{c.location}</p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-700">
                <div>Phone: <strong>{c.phone}</strong></div>
                <div>Email: <strong className="text-slate-900">{c.email}</strong></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
