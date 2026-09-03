import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FlaskConical, 
  FileCheck2, 
  User, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  BadgeCheck, 
  Sparkles,
  Lock,
  Building2,
  Clock
} from 'lucide-react';
import PasswordField from '../components/PasswordField';
import { useToast } from '../context/ToastContext';

export default function LoginPage({
  onLoginSuccess,
  onBackToHome,
  personas = [],
  initialCadre = 'POLICE'
}) {
  const toast = useToast();
  const [activeCadre, setActiveCadre] = useState(initialCadre); // 'POLICE' | 'JUDICIAL' | 'FORENSIC' | 'AUDITOR' | 'CITIZEN'
  
  // Officer credentials
  const [employeeId, setEmployeeId] = useState('POL-DL-4892');
  const [password, setPassword] = useState('123456');
  
  // Citizen credentials
  const [citizenIdentifier, setCitizenIdentifier] = useState('9876543210');
  const [citizenOtp, setCitizenOtp] = useState('123456');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Cadre Tab Switch
  const handleCadreChange = (cadre) => {
    setActiveCadre(cadre);
    setErrorMsg('');
    if (cadre === 'POLICE') {
      setEmployeeId('POL-DL-4892');
      setPassword('123456');
    } else if (cadre === 'JUDICIAL') {
      setEmployeeId('JUD-ND-1044');
      setPassword('123456');
    } else if (cadre === 'FORENSIC') {
      setEmployeeId('FSL-EXP-209');
      setPassword('123456');
    } else if (cadre === 'AUDITOR') {
      setEmployeeId('AUD-MHA-007');
      setPassword('123456');
    } else if (cadre === 'CITIZEN') {
      setCitizenIdentifier('9876543210');
      setCitizenOtp('123456');
    }
  };

  // Submit Officer Login
  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          otp: password.trim(),
          rolePortal: activeCadre
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication rejected by security gate.');

      toast.success(`Welcome back, ${data.user.name} (${data.user.rank || data.user.role})`);
      onLoginSuccess(data.user);
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Citizen Login
  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const isMobile = /^\d{10}$/.test(citizenIdentifier.trim());
      const res = await fetch('/api/citizen/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: isMobile ? citizenIdentifier.trim() : undefined,
          ackNumber: !isMobile ? citizenIdentifier.trim() : undefined,
          otp: citizenOtp.trim() || '123456'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Citizen verification failed');

      toast.success(`Authenticated as Citizen ${data.citizen.name}`);
      onLoginSuccess({
        id: data.citizen.id,
        name: data.citizen.name,
        role: 'Verified Citizen Complainant',
        portalRole: 'CITIZEN',
        mobile: data.citizen.mobile,
        ackNumber: data.citizen.ackNumber
      });
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cadreTabs = [
    { id: 'POLICE', label: 'Police Cadre', icon: ShieldCheck, color: 'text-orange-600', badge: 'CrPC §154' },
    { id: 'JUDICIAL', label: 'Judicial Authority', icon: Scale, color: 'text-sky-600', badge: 'BSA §63' },
    { id: 'FORENSIC', label: 'Forensic Lab', icon: FlaskConical, color: 'text-emerald-600', badge: 'CFSL / RFSL' },
    { id: 'AUDITOR', label: 'Statutory Auditor', icon: FileCheck2, color: 'text-purple-600', badge: 'WORM Vault' },
    { id: 'CITIZEN', label: 'Citizen Portal', icon: User, color: 'text-slate-600', badge: 'Direct Tracking' }
  ];

  const currentCadreConfig = cadreTabs.find(c => c.id === activeCadre);

  return (
    <div className="flex-1 bg-[#FFF9F2] dark:bg-slate-950 min-h-[calc(100vh-140px)] p-4 sm:p-8 flex flex-col justify-center items-center transition-colors">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Navigation Return */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#FF6A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Portal Home</span>
        </button>

        {/* Main Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-[#FF6A1A] mx-auto flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Official Cadre & Citizen Secure Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Federated zero-knowledge gateway protected by 256-bit encrypted HSM credentials
            </p>
          </div>

          {/* Cadre Selection Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {cadreTabs.map((cadre) => {
              const Icon = cadre.icon;
              const isActive = activeCadre === cadre.id;
              return (
                <button
                  key={cadre.id}
                  type="button"
                  onClick={() => handleCadreChange(cadre.id)}
                  className={`p-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? cadre.color : 'text-slate-400'}`} />
                  <span className="truncate text-[11px]">{cadre.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Cadre Descriptor Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeCadre === 'POLICE' ? 'bg-[#FF6A1A]' :
                activeCadre === 'JUDICIAL' ? 'bg-[#4FA8E0]' :
                activeCadre === 'FORENSIC' ? 'bg-[#5FA777]' :
                activeCadre === 'AUDITOR' ? 'bg-purple-600' : 'bg-slate-500'
              }`} />
              <span>{currentCadreConfig.label} Access Gateway</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              {currentCadreConfig.badge}
            </span>
          </div>

          {/* Forms */}
          {activeCadre !== 'CITIZEN' ? (
            /* OFFICIAL CADRE FORM (Police, Judicial, Forensic, Auditor) */
            <form onSubmit={handleOfficerLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeCadre === 'POLICE' ? 'Police Officer Badge ID / Employee ID' :
                   activeCadre === 'JUDICIAL' ? 'Judicial Magistrate / Officer ID' :
                   activeCadre === 'FORENSIC' ? 'Scientific Officer / FSL Lab ID' :
                   'Auditor / CAG ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. POL-DL-4892"
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A] focus:bg-white dark:focus:bg-slate-950 uppercase"
                  />
                </div>
              </div>

              {/* Password / OTP Field with Visibility Toggle */}
              <PasswordField
                id="officer-password"
                name="password"
                label="Security Password / HSM Passcode (Demo: 123456)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password or OTP"
                required
              />

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8C42] hover:from-[#e05910] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Verifying HSM Signature...' : `Authenticate as ${currentCadreConfig.label}`}</span>
              </button>
            </form>
          ) : (
            /* CITIZEN FORM (Mobile / Ack + OTP) */
            <form onSubmit={handleCitizenLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Registered Mobile Number or FIR Acknowledgement No.
                </label>
                <input
                  type="text"
                  value={citizenIdentifier}
                  onChange={(e) => setCitizenIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or FIR-2024-ND-0842"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A] focus:bg-white dark:focus:bg-slate-950 font-medium"
                />
              </div>

              <PasswordField
                id="citizen-otp"
                name="otp"
                label="6-Digit Verification OTP (Demo: 123456)"
                value={citizenOtp}
                onChange={(e) => setCitizenOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8C42] hover:from-[#e05910] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>{loading ? 'Validating Token...' : 'Track My Complaints & Crime Records'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Personas (1-Click Fill)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleCadreChange('POLICE');
                  setEmployeeId('POL-DL-4892');
                  setPassword('123456');
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-orange-600 truncate">Inspector Rajesh</div>
                <div className="text-[9px] text-slate-500 font-mono">POL-DL-4892</div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  handleCadreChange('JUDICIAL');
                  setEmployeeId('JUD-ND-1044');
                  setPassword('123456');
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-sky-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-sky-600 truncate">Hon. Justice Iyer</div>
                <div className="text-[9px] text-slate-500 font-mono">JUD-ND-1044</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCadreChange('FORENSIC');
                  setEmployeeId('FSL-EXP-209');
                  setPassword('123456');
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-emerald-600 truncate">Dr. Sunita Rao</div>
                <div className="text-[9px] text-slate-500 font-mono">FSL-EXP-209</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCadreChange('AUDITOR');
                  setEmployeeId('AUD-MHA-007');
                  setPassword('123456');
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-purple-600 truncate">Auditor General</div>
                <div className="text-[9px] text-slate-500 font-mono">AUD-MHA-007</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
