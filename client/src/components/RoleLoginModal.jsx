import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Scale, 
  Microscope, 
  X, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Building2, 
  Fingerprint, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { translations } from '../i18n/translations';

/**
 * 3-Portal Login Modal (Light aesthetic per master spec)
 * - Centered white card on light blurred backdrop
 * - Police: Shield crest, Employee ID/Badge, Police Station dropdown, OTP, Saffron-orange button
 * - Judicial: Scales crest, Judicial ID/Bar Council No, Court dropdown, OTP, Chakra-blue button
 * - Forensic: Microscope crest, Lab ID, Lab unit dropdown, OTP, Sage-green button
 */
export default function RoleLoginModal({ 
  isOpen, 
  initialRole = 'POLICE', 
  onClose, 
  onLoginSuccess, 
  personas = [],
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [employeeId, setEmployeeId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    // Populate sensible defaults for demo convenience
    if (selectedRole === 'POLICE') {
      setEmployeeId('POL-DL-4892');
      setJurisdiction('Special Investigation Division PS, Mandir Marg');
    } else if (selectedRole === 'JUDICIAL') {
      setEmployeeId('JUD-DEL-089');
      setJurisdiction('Patiala House Courts, New Delhi');
    } else if (selectedRole === 'FORENSIC') {
      setEmployeeId('FSL-CBI-702');
      setJurisdiction('CFSL New Delhi');
    }
  }, [selectedRole]);

  if (!isOpen) return null;

  const roleConfig = {
    POLICE: {
      title: "Police Login",
      titleHindi: "पुलिस पोर्टल लॉगिन",
      idLabel: "Employee ID / Badge No.",
      idPlaceholder: "e.g. POL-DL-4892",
      stationLabel: "Assigned Police Station",
      stations: [
        "Special Investigation Division PS, Mandir Marg",
        "State Criminal Investigation Department, Mumbai",
        "Central Police Station, CID, Bengaluru"
      ],
      icon: Shield,
      btnColor: "bg-[#FF6A1A] hover:bg-[#E85B0E] text-white",
      themeAccent: "text-[#FF6A1A]",
      badgeText: "Police / IO Cadre"
    },
    JUDICIAL: {
      title: "Judicial Portal Login",
      titleHindi: "न्यायिक पोर्टल लॉगिन",
      idLabel: "Judicial ID / Bar Council No.",
      idPlaceholder: "e.g. JUD-DEL-089",
      stationLabel: "Court / Jurisdiction",
      stations: [
        "Patiala House Courts, New Delhi",
        "High Court of Delhi",
        "City Civil & Sessions Court, Mumbai"
      ],
      icon: Scale,
      btnColor: "bg-[#4FA8E0] hover:bg-[#3b8ec2] text-white",
      themeAccent: "text-[#4FA8E0]",
      badgeText: "Judiciary / Court Cadre"
    },
    FORENSIC: {
      title: "Forensic Lab Login",
      titleHindi: "फॉरेंसिक लैब लॉगिन",
      idLabel: "Lab ID / Employee ID",
      idPlaceholder: "e.g. FSL-CBI-702",
      stationLabel: "Lab / Forensic Unit",
      stations: [
        "CFSL New Delhi",
        "SFSL Bengaluru",
        "State Forensic Science Laboratory, Mumbai"
      ],
      icon: Microscope,
      btnColor: "bg-[#5FA777] hover:bg-[#4d8961] text-white",
      themeAccent: "text-[#5FA777]",
      badgeText: "Forensic Science Lab Cadre"
    }
  };

  const currentConfig = roleConfig[selectedRole];
  const CrestIcon = currentConfig.icon;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const match = personas.find(p => p.id === employeeId && p.portalRole === selectedRole);
      if (match) {
        onLoginSuccess(match);
        onClose();
      } else {
        const fallback = personas.find(p => p.portalRole === selectedRole) || personas[0];
        onLoginSuccess(fallback);
        onClose();
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Centered White Card on Light Backdrop */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#FFF9F2]/80">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center ${currentConfig.themeAccent}`}>
              <CrestIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'hi' ? currentConfig.titleHindi : currentConfig.title}
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {currentConfig.badgeText}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Tab Switcher within Modal */}
        <div className="px-6 pt-4">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('POLICE')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'POLICE' ? 'bg-white text-[#FF6A1A] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Police / IO
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('JUDICIAL')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'JUDICIAL' ? 'bg-white text-[#4FA8E0] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Judicial
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('FORENSIC')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'FORENSIC' ? 'bg-white text-[#5FA777] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forensic Lab
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {/* Employee ID / Badge */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {currentConfig.idLabel}
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder={currentConfig.idPlaceholder}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              required
            />
          </div>

          {/* Station / Court Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {currentConfig.stationLabel}
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            >
              {currentConfig.stations.map((st, i) => (
                <option key={i} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* OTP Field */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-bold text-slate-700">One-Time Password (OTP)</label>
              <span className="text-[10px] text-emerald-600 font-bold">Demo OTP: 123456</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                maxLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Submit Button with Role Color */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${currentConfig.btnColor} disabled:opacity-50`}
          >
            <span>{loading ? 'Authenticating...' : `Enter ${currentConfig.title}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Persona Picker for Easy Demo Evaluation */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2 text-center">
              Available Generic Cadre Personas
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {personas.filter(p => p.portalRole === selectedRole).map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    setEmployeeId(p.id);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                    employeeId === p.id 
                      ? 'bg-orange-50 border-orange-300 text-orange-800 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.badge} ({p.name.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
