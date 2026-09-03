import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, Check, ArrowRight, UserCheck } from 'lucide-react';
import AshokaEmblem from './AshokaEmblem';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, personas = [] }) {
  const [employeeId, setEmployeeId] = useState('POL-DL-4892');
  const [otp, setOtp] = useState('123456');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, otp })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = (persona) => {
    setEmployeeId(persona.id);
    setOtp(persona.otp || '123456');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Centered White Card on Dark Blurred Background */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Tricolor top border */}
        <div className="tricolor-stripe"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <AshokaEmblem className="w-10 h-12 mb-3" color="#0F1729" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              SecureChain DMS
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              National Digital Evidence Management & Case Repository — Officer Authentication Gate
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Employee / Cadre ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. POL-DL-4892"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  OTP Authentication
                </label>
                <span className="text-[11px] text-emerald-600 font-medium cursor-pointer" onClick={() => setOtp('123456')}>
                  Demo Code: 123456
                </span>
              </div>
              <div className="relative">
                <input
                  type={showOtp ? 'text' : 'password'}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Full-width Dark Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0F1729] hover:bg-[#1e2a47] text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Persona Picker for Demo Flow */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Demo Persona (Instant Fill)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    employeeId === p.id 
                      ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-semibold' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="truncate font-bold">{p.name.split(' ')[1] || p.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.rank}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trouble Logging In Link */}
          <div className="mt-5 text-center">
            <a 
              href="#help" 
              onClick={(e) => { e.preventDefault(); alert("National Cyber Helpline: 1930\nFor demo testing, use Employee ID 'POL-DL-4892' with OTP '123456'."); }}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel / Trouble logging in?
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
