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
  Clock,
  Phone,
  FileSpreadsheet
} from 'lucide-react';
import PasswordField from '../components/PasswordField';
import { useToast } from '../context/ToastContext';

/**
 * Unified Login Page (/login) per Master Spec Section 4:
 * - One page, one URL
 * - Top row of role tabs: Citizen | Police | Judicial | Forensic | Auditor
 * - Selecting a tab reveals role-specific fields inside the same card:
 *    - Citizen: Two sub-options ("By Mobile Number" vs "By Acknowledgement/Complaint Number") + OTP
 *    - Police: Badge/Employee ID, Police Station dropdown, Password/OTP
 *    - Judicial: Judicial ID / Bar Council No., Court/Jurisdiction dropdown, Password/OTP
 *    - Forensic: Lab ID / Employee ID, Lab/Unit dropdown, Password/OTP
 *    - Auditor: Auditor ID, Password/OTP (The ONLY way to reach audit log functionality)
 * - PasswordField visibility toggle (eye icon) on all secret fields
 * - Demo personas use strictly generic role titles
 * - Fully styled for both Light and Dark themes
 */
export default function LoginPage({
  onLoginSuccess,
  onCancel,
  initialRole = 'CITIZEN'
}) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(initialRole.toUpperCase()); // 'CITIZEN' | 'POLICE' | 'JUDICIAL' | 'FORENSIC' | 'AUDITOR'
  
  // Citizen state
  const [citizenMode, setCitizenMode] = useState('MOBILE'); // 'MOBILE' | 'ACK'
  const [mobileNumber, setMobileNumber] = useState('');
  const [ackNumber, setAckNumber] = useState('');
  const [citizenSecondFactor, setCitizenSecondFactor] = useState('');
  const [citizenOtp, setCitizenOtp] = useState('');

  // Police state — all blank on page load
  const [policeId, setPoliceId] = useState('');
  const [policeStation, setPoliceStation] = useState('');
  const [policePassword, setPolicePassword] = useState('');

  // Judicial state — all blank on page load
  const [judicialId, setJudicialId] = useState('');
  const [judicialCourt, setJudicialCourt] = useState('');
  const [judicialPassword, setJudicialPassword] = useState('');

  // Forensic state — all blank on page load
  const [forensicId, setForensicId] = useState('');
  const [forensicLab, setForensicLab] = useState('');
  const [forensicPassword, setForensicPassword] = useState('');

  // Auditor state — all blank on page load
  const [auditorId, setAuditorId] = useState('');
  const [auditorPassword, setAuditorPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTabSwitch = (role) => {
    setActiveTab(role);
    setErrorMsg('');
  };

  // Submit Official Cadre Login
  // extraData: typed location fields (policeStation / court / labUnit) to merge into the returned user
  const handleOfficerLogin = async (e, rolePortal, employeeId, password, extraData = {}) => {
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
          rolePortal
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication rejected by credential gateway.');

      // Merge any typed location fields so ProfileCard displays what the user entered
      const enrichedUser = { ...data.user, ...extraData };

      toast.success(`Authenticated successfully as ${enrichedUser.name} (${enrichedUser.role || enrichedUser.rank})`);
      onLoginSuccess(enrichedUser);
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
      const res = await fetch('/api/citizen/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: citizenMode === 'MOBILE' ? mobileNumber.trim() : undefined,
          ackNumber: citizenMode === 'ACK' ? ackNumber.trim() : undefined,
          secondFactor: citizenMode === 'ACK' ? citizenSecondFactor.trim() : undefined,
          otp: citizenOtp.trim() || '123456'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Citizen credential validation failed.');

      toast.success(`Authenticated as Citizen Complainant (${data.citizen.name})`);
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

  const roleTabs = [
    { id: 'CITIZEN', label: 'Citizen', icon: User, color: 'text-amber-600', badge: 'Public Tracking' },
    { id: 'POLICE', label: 'Police / IO', icon: ShieldCheck, color: 'text-[#FF6A1A]', badge: 'CrPC §154' },
    { id: 'JUDICIAL', label: 'Judicial', icon: Scale, color: 'text-sky-600', badge: 'BSA §63 / $65B' },
    { id: 'FORENSIC', label: 'Forensic', icon: FlaskConical, color: 'text-emerald-600', badge: 'ISO/IEC 17025' },
    { id: 'AUDITOR', label: 'Auditor', icon: FileCheck2, color: 'text-purple-600', badge: 'WORM Vault' }
  ];

  return (
    <div className="flex-1 bg-[#FFF9F2] dark:bg-slate-950 min-h-[calc(100vh-140px)] p-4 sm:p-8 flex flex-col justify-center items-center transition-colors">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Navigation Return */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#FF6A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal Home</span>
        </button>

        {/* Main Unified Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-[#FF6A1A] mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-serif">
              SecureChain DMS Access Gateway
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Single unified login with role-scoped credential routing
            </p>
          </div>

          {/* Role Tabs Row */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
                  <span className="truncate text-[10px] sm:text-[11px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Descriptor */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeTab === 'POLICE' ? 'bg-[#FF6A1A]' :
                activeTab === 'JUDICIAL' ? 'bg-[#4FA8E0]' :
                activeTab === 'FORENSIC' ? 'bg-[#5FA777]' :
                activeTab === 'AUDITOR' ? 'bg-purple-600' : 'bg-amber-500'
              }`} />
              <span>{roleTabs.find(t => t.id === activeTab)?.label} Gateway</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              {roleTabs.find(t => t.id === activeTab)?.badge}
            </span>
          </div>

          {/* ================= 1. CITIZEN TAB ================= */}
          {activeTab === 'CITIZEN' && (
            <div className="space-y-4">
              {/* Sub-option Selector */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCitizenMode('MOBILE')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    citizenMode === 'MOBILE'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  By Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => setCitizenMode('ACK')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    citizenMode === 'ACK'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  By Acknowledgement / FIR No.
                </button>
              </div>

              <form onSubmit={handleCitizenLogin} className="space-y-4">
                {citizenMode === 'MOBILE' ? (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      10-Digit Registered Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Complaint / FIR Acknowledgement Number
                      </label>
                      <input
                        type="text"
                        value={ackNumber}
                        onChange={(e) => setAckNumber(e.target.value)}
                        placeholder="e.g. ACK-2024-88412 or FIR-2024-ND-0842"
                        required
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Second Factor (Registered Mobile or Email)
                      </label>
                      <input
                        type="text"
                        value={citizenSecondFactor}
                        onChange={(e) => setCitizenSecondFactor(e.target.value)}
                        placeholder="e.g. citizen.delhi@gov.in or 9876543210"
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A]"
                      />
                    </div>
                  </>
                )}

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
                  className="w-full py-2.5 bg-[#FF6A1A] hover:bg-[#e05910] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>{loading ? 'Verifying OTP...' : 'Track My Case Records'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= 2. POLICE TAB ================= */}
          {activeTab === 'POLICE' && (
            <form onSubmit={(e) => handleOfficerLogin(e, 'POLICE', policeId, policePassword, { policeStation })} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Badge ID / Police Official Employee ID
                </label>
                <input
                  type="text"
                  value={policeId}
                  onChange={(e) => setPoliceId(e.target.value)}
                  placeholder="e.g. POL-DL-4892"
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A] uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Police Station (Jurisdiction)
                </label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="e.g. Special Investigation Division PS, Mandir Marg"
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#FF6A1A]"
                />
              </div>

              <PasswordField
                id="police-password"
                name="password"
                label="Security Password / Passcode (Demo: 123456)"
                value={policePassword}
                onChange={(e) => setPolicePassword(e.target.value)}
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
                className="w-full py-2.5 bg-[#FF6A1A] hover:bg-[#e05910] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In as Police Official'}</span>
              </button>
            </form>
          )}

          {/* ================= 3. JUDICIAL TAB ================= */}
          {activeTab === 'JUDICIAL' && (
            <form onSubmit={(e) => handleOfficerLogin(e, 'JUDICIAL', judicialId, judicialPassword, { court: judicialCourt })} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judicial ID / Bar Council Roll No.
                </label>
                <input
                  type="text"
                  value={judicialId}
                  onChange={(e) => setJudicialId(e.target.value)}
                  placeholder="e.g. JUD-ND-1044"
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4FA8E0] uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Court / Jurisdiction
                </label>
                <input
                  type="text"
                  value={judicialCourt}
                  onChange={(e) => setJudicialCourt(e.target.value)}
                  placeholder="e.g. Patiala House Courts, New Delhi"
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4FA8E0]"
                />
              </div>

              <PasswordField
                id="judicial-password"
                name="password"
                label="Security Password / Judicial Token (Demo: 123456)"
                value={judicialPassword}
                onChange={(e) => setJudicialPassword(e.target.value)}
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
                className="w-full py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Scale className="w-4 h-4" />
                <span>{loading ? 'Validating Token...' : 'Sign In as Judicial Officer'}</span>
              </button>
            </form>
          )}

          {/* ================= 4. FORENSIC TAB ================= */}
          {activeTab === 'FORENSIC' && (
            <form onSubmit={(e) => handleOfficerLogin(e, 'FORENSIC', forensicId, forensicPassword, { labUnit: forensicLab })} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Forensic Officer Lab ID / Employee ID
                </label>
                <input
                  type="text"
                  value={forensicId}
                  onChange={(e) => setForensicId(e.target.value)}
                  placeholder="e.g. FSL-EXP-209"
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#5FA777] uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Forensic Laboratory / Unit
                </label>
                <input
                  type="text"
                  value={forensicLab}
                  onChange={(e) => setForensicLab(e.target.value)}
                  placeholder="e.g. Central Forensic Science Laboratory (CFSL), New Delhi"
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#5FA777]"
                />
              </div>

              <PasswordField
                id="forensic-password"
                name="password"
                label="Lab Passcode / HSM Key (Demo: 123456)"
                value={forensicPassword}
                onChange={(e) => setForensicPassword(e.target.value)}
                placeholder="Enter passcode"
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
                className="w-full py-2.5 bg-[#5FA777] hover:bg-[#4E9264] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{loading ? 'Authenticating Lab...' : 'Sign In as Forensic Officer'}</span>
              </button>
            </form>
          )}

          {/* ================= 5. AUDITOR TAB ================= */}
          {activeTab === 'AUDITOR' && (
            <form onSubmit={(e) => handleOfficerLogin(e, 'AUDITOR', auditorId, auditorPassword)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Auditor ID / Statutory Audit Authority ID
                </label>
                <input
                  type="text"
                  value={auditorId}
                  onChange={(e) => setAuditorId(e.target.value)}
                  placeholder="e.g. AUD-MHA-007"
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 uppercase"
                />
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-xl text-[11px] text-purple-700 dark:text-purple-300">
                Exclusive statutory gateway: Provides access to the WORM write-once audit trail, tamper verification, and de-anonymization authority.
              </div>

              <PasswordField
                id="auditor-password"
                name="password"
                label="Master Audit Key / HSM Passcode (Demo: 123456)"
                value={auditorPassword}
                onChange={(e) => setAuditorPassword(e.target.value)}
                placeholder="Enter auditor passcode"
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
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{loading ? 'Accessing Ledger...' : 'Sign In as Statutory Auditor'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Fill Pills — fills all fields for convenience; does NOT pre-fill on page load */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Fill (Generic Titles)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-left">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('CITIZEN');
                  setCitizenMode('MOBILE');
                  setMobileNumber('9876543210');
                  setCitizenOtp('123456');
                }}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-bold text-amber-600 truncate">Citizen</div>
                <div className="text-[9px] text-slate-400 font-mono">9876543210</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('POLICE');
                  setPoliceId('POL-DL-4892');
                  setPoliceStation('Special Investigation Division PS, Mandir Marg');
                  setPolicePassword('123456');
                }}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-400 transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-bold text-orange-600 truncate">Police Official</div>
                <div className="text-[9px] text-slate-400 font-mono">POL-DL-4892</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('JUDICIAL');
                  setJudicialId('JUD-ND-1044');
                  setJudicialCourt('Patiala House Courts, New Delhi');
                  setJudicialPassword('123456');
                }}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-sky-400 transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-bold text-sky-600 truncate">Judicial Officer</div>
                <div className="text-[9px] text-slate-400 font-mono">JUD-ND-1044</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('FORENSIC');
                  setForensicId('FSL-EXP-209');
                  setForensicLab('Central Forensic Science Laboratory (CFSL), New Delhi');
                  setForensicPassword('123456');
                }}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-bold text-emerald-600 truncate">Forensic Officer</div>
                <div className="text-[9px] text-slate-400 font-mono">FSL-EXP-209</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('AUDITOR');
                  setAuditorId('AUD-MHA-007');
                  setAuditorPassword('123456');
                }}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-400 transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-bold text-purple-600 truncate">Statutory Auditor</div>
                <div className="text-[9px] text-slate-400 font-mono">AUD-MHA-007</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
