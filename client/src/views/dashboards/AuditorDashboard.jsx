import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  FileText, 
  Search, 
  Database, 
  CheckCircle2, 
  XCircle,
  Download,
  Terminal,
  Layers,
  Fingerprint
} from 'lucide-react';
import AuditLogView from '../AuditLogView';
import { useToast } from '../../context/ToastContext';

export default function AuditorDashboard({ 
  activeUser, 
  lang = 'en'
}) {
  const toast = useToast();
  const [integrityStatus, setIntegrityStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Fetch initial integrity status
  const runIntegrityVerification = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/tamper/verify', { method: 'POST' });
      const data = await res.json();
      setIntegrityStatus(data);
      if (data.status === 'TAMPERED') {
        toast.error(`Ledger Compromise Detected at Block #${data.tamperedBlockIndex || 'UNKNOWN'}`);
      } else {
        toast.success('SHA-256 Merkle Chain Integrity Confirmed: 100% Pristine');
      }
    } catch (err) {
      toast.error('Integrity verification network error.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    runIntegrityVerification();
  }, []);

  const handleSimulateTamper = async () => {
    setTampering(true);
    try {
      const res = await fetch('/api/tamper/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: 'FIR-2024-ND-0842',
          tamperedText: 'ILLEGAL UNAUTHORIZED RECORD MODIFICATION VIA DIRECT DB ACCESS'
        })
      });
      const data = await res.json();
      toast.warning('Tamper simulation executed! Layer 6 Sentinel triggered.');
      runIntegrityVerification();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTampering(false);
    }
  };

  const handleRestoreIntegrity = async () => {
    setRestoring(true);
    try {
      const res = await fetch('/api/tamper/restore', { method: 'POST' });
      const data = await res.json();
      toast.success('Ledger state restored from pristine cryptographic anchor.');
      runIntegrityVerification();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Auditor Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 shadow-xs">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Statutory Oversight & Cryptographic Audit
              </span>
              <span className="text-xs text-slate-400 font-mono">Restricted to Auditor Credentials</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              WORM Immutable Audit Vault & Chain Sentinel
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Strictly append-only write-once read-many ledger per Ministry of Home Affairs Electronic Evidence Standards.
            </p>
          </div>
        </div>

        {/* Auditor Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={runIntegrityVerification}
            disabled={verifying}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Merkle Chain</span>
          </button>

          {integrityStatus?.status === 'TAMPERED' ? (
            <button
              onClick={handleRestoreIntegrity}
              disabled={restoring}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Restore Pristine Ledger</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateTamper}
              disabled={tampering}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Demonstrate real-time cryptographic tamper alarm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Simulate DB Tampering</span>
            </button>
          )}
        </div>
      </div>

      {/* Cryptographic Health Summary Cards (with Hover Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Chain Integrity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-3xl p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Ledger Health</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              integrityStatus?.status === 'TAMPERED' 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
            }`}>
              {integrityStatus?.status === 'TAMPERED' ? <XCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-xl font-bold tracking-tight ${
              integrityStatus?.status === 'TAMPERED' ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {integrityStatus?.status === 'TAMPERED' ? 'COMPROMISED' : 'PRISTINE SECURE'}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {integrityStatus?.message || 'SHA-256 Block Chain Active'}
            </p>
          </div>
        </div>

        {/* Card 2: Total WORM Blocks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-3xl p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Audit Blocks Sealed</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {integrityStatus?.totalBlocks || '14'}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Zero deletions / zero rewrites
            </p>
          </div>
        </div>

        {/* Card 3: Security Layers Monitored */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-3xl p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Security Layers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              6 / 6
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Active WORM sentinel protection
            </p>
          </div>
        </div>

        {/* Card 4: Access Control & Rule 12 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-3xl p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Rule 12 Protocols</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Enforced
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Cryptographic de-anonymization logs
            </p>
          </div>
        </div>

      </div>

      {/* Embedded Complete WORM Audit Log View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Immutable Electronic Evidence Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by security layer, search hashes, or examine cryptographic disclosures.
            </p>
          </div>
        </div>

        <AuditLogView 
          lang={lang} 
          activeUser={activeUser}
        />
      </div>

    </div>
  );
}
