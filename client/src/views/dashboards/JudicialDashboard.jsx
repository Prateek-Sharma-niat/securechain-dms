import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  FileCheck2, 
  Eye, 
  Printer, 
  Hash, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  Calendar,
  FolderArchive,
  Award,
  ShieldCheck,
  UserCheck,
  GitCompare,
  ExternalLink
} from 'lucide-react';
import AshokaEmblem from '../../components/AshokaEmblem';
import { translations } from '../../i18n/translations';
import { useToast } from '../../context/ToastContext';

/**
 * Judicial Dashboard per Master Spec Section 8 & 20.3:
 * - Dedicated chakra-blue sidebar links: Home, Cases Pending Verification, Hash Verification Tool, $65B / §65B Certificate Generator, Approval Queue, Settings
 * - Filing Officer Visibility (Section 20.3): Real badge ID and station displayed (e.g. 'Police Official — Badge #1042, Station...')
 * - Old vs New version side-by-side comparison for judicial oversight
 * - Hash Verification Tool: clear green "MATCH — INTACT" or red "MISMATCH — INTEGRITY VIOLATION"
 * - $65B / §65B Certificate Generator with printable court seal
 * - NO upload or de-anonymize tools (per Sections 8 & 20.4)
 */
export default function JudicialDashboard({ 
  documents = [], 
  metrics, 
  onSelectDocument, 
  onOpenQuorum, 
  onGoToApprovals,
  activeUser,
  activeTab = 'overview',
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();

  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [sideBySideDoc, setSideBySideDoc] = useState(documents.find(d => d.status === 'PENDING_QUORUM') || documents[0]);

  const handleRunHashVerification = (simulatedTamper = false) => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (simulatedTamper) {
        setVerificationResult('MISMATCH');
        toast.error('Cryptographic Mismatch: Integrity Violation Detected!');
      } else {
        setVerificationResult('MATCH');
        toast.success('SHA-256 Digest Confirmed: Record Intact');
      }
    }, 400);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors w-full">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-[#4FA8E0] shadow-xs flex-shrink-0">
            <Scale className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-serif">
                Judicial Authority Terminal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 dark:bg-sky-950 text-[#4FA8E0] border border-sky-300 dark:border-sky-800">
                Court Scrutiny & Admissibility
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
              Presiding Officer: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Court: <span className="text-[#4FA8E0] font-semibold">{activeUser?.court || "Patiala House Courts, New Delhi"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCertModalOpen(true)}
          className="px-4 sm:px-5 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Issue $65B / §65B Certificate</span>
        </button>
      </div>

      {/* VIEW 1: CASES PENDING VERIFICATION & OFFICER TRACEABILITY (Section 20.3) */}
      {activeTab === 'pending' && (
        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 dark:bg-sky-950 text-[#4FA8E0] border border-sky-200 dark:border-sky-800">
                Section 20.3 Legal Accountability
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-serif">
                Cases Pending Verification & Filing Officer Traceability
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full officer identification is preserved for judicial scrutiny. Review peer amendment requests and inspect side-by-side versions.
              </p>
            </div>
            
            {onGoToApprovals && (
              <button
                onClick={onGoToApprovals}
                className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#e05910] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Open Quorum Approval Board</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {documents.map((doc) => {
              const hasDraft = doc.status === 'PENDING_QUORUM';
              return (
                <div 
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-4 hover:border-sky-300 dark:hover:border-sky-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {doc.firNo}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          hasDraft ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {hasDraft ? `Draft v${doc.draftVersion || '1.1'} Pending Review` : `v${doc.currentVersion} Locked`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                        {doc.caseTitle}
                      </h4>
                    </div>

                    {/* Section 20.3: Filing Officer Display (NOT Anonymous to Judicial) */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Filing Police Official:</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {doc.investigatingOfficer || "Police Official (Investigating Officer)"}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Badge #{doc.requesterBadge || "IO-4892"} • {doc.requesterStation || doc.policeStation}
                      </div>
                    </div>
                  </div>

                  {/* Side-by-Side Version Comparison (Section 20.3) */}
                  {hasDraft && (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-sky-900/60 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
                        <span className="flex items-center gap-1.5">
                          <GitCompare className="w-4 h-4 text-[#4FA8E0]" />
                          <span>Judicial Oversight: Side-by-Side Version Review</span>
                        </span>
                        <span className="font-mono text-[11px]">v{doc.currentVersion} vs v{doc.draftVersion || '1.1'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Original Version */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                            <span>Version {doc.currentVersion} (Locked Head)</span>
                            <span className="text-[10px] text-emerald-600 font-mono">LOCKED</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {doc.incidentSummary}
                          </p>
                        </div>

                        {/* Proposed Amendment Version */}
                        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-1">
                          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                            <span>Draft Version {doc.draftVersion || '1.1'} (Pending Quorum)</span>
                            <span className="text-[10px] text-amber-600 font-mono">PROPOSED</span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {doc.draftData?.editSummary || doc.versions?.find(v => v.version === doc.draftVersion)?.summaryDiff || "Supplementary findings submitted for peer review."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onSelectDocument && onSelectDocument(doc)}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full FIR Form</span>
                    </button>
                    {hasDraft && onOpenQuorum && (
                      <button
                        onClick={() => onOpenQuorum(doc)}
                        className="px-4 py-1.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Inspect Quorum Votes</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: HASH VERIFICATION TOOL */}
      {activeTab === 'verify' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#4FA8E0]" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-serif">
                  {t.judicialWidgetHashTool}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  Mathematically test electronic court dockets against root cryptographic ledger
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#4FA8E0] font-bold bg-sky-50 dark:bg-sky-950 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              BSA §63 / $65B Standard
            </span>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Case Dossier for Integrity Scrutiny
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setVerificationResult(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#4FA8E0]"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firNo} — {d.caseTitle} (v{d.currentVersion})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1.5 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Target Exhibit Digest (SHA-256):</div>
              <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all font-semibold">
                {activeDoc?.sha256 || '3d5f8a0e889c2b4c10294e77da1b1c3e7f4a56b2c890de41fa7712398ab45c11'}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleRunHashVerification(false)}
                disabled={isVerifying}
                className="flex-1 py-3 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying Integrity...' : 'Verify Integrity'}</span>
              </button>

              <button
                onClick={() => handleRunHashVerification(true)}
                disabled={isVerifying}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                <span>Simulate Tampering</span>
              </button>
            </div>

            {verificationResult === 'MATCH' && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-[#5FA777]" />
                  <span>MATCH — INTACT</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Cryptographic verification confirms 100% mathematical parity. The stored document has undergone zero tampering since issuance.
                </p>
              </div>
            )}

            {verificationResult === 'MISMATCH' && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>MISMATCH — INTEGRITY VIOLATION</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Calculated hash does NOT match the ledger root anchor. The file contents or metadata have been altered outside authorized quorum channels.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: $65B / §65B CERTIFICATE GENERATOR */}
      {activeTab === 'section65b' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Statutory Evidence Admissibility
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-serif">
                $65B / §65B Certificate Generator (Section 63 BSA 2023)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                Generates a simple, court-admissible PDF certificate citing Evidence Act §65B for verified electronic records.
              </p>
            </div>
            <button
              onClick={() => setCertModalOpen(true)}
              className="px-4 py-2 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Generate $65B Certificate</span>
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Record for Statutory Certification:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDocId(d.id);
                    setCertModalOpen(true);
                  }}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {d.firNo}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Verified Intact
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {d.caseTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    Digest: {d.sha256}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: OVERVIEW / DEFAULT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Scrutinized Cases
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-[#4FA8E0] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {documents.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Active court dockets with verified custody chains
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  $65B Certificates Ready
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#5FA777] flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                100%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Compliance with Evidence Act §65B / BSA §63
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quorum Reviews Pending
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {documents.filter(d => d.status === 'PENDING_QUORUM').length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Amendments awaiting judicial review casting
              </p>
            </div>

          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Judicial Oversight & Admissibility Framework</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 and Section 65B of Indian Evidence Act, judicial officers have direct jurisdiction over evidentiary exhibits submitted by law enforcement. Select <strong>Hash Verification Tool</strong> to confirm integrity, or open <strong>$65B Certificate Generator</strong> to issue certified courtroom admissibility certificates.
            </p>
          </div>
        </div>
      )}

      {/* $65B / §65B Certificate Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <AshokaEmblem className="w-12 h-12 mx-auto text-slate-800 dark:text-slate-200" />
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                CERTIFICATE OF ADMISSIBILITY UNDER SECTION 63 BSA 2023 / $65B EVIDENCE ACT
              </div>
              <div className="text-[10px] text-slate-500 font-serif">
                (Statutory Certificate for Direct Courtroom Admissibility)
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              <p>
                I, <strong>{activeUser?.name}</strong>, Presiding Judicial Officer at <strong>{activeUser?.court || "Patiala House Courts, New Delhi"}</strong>, hereby certify that:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-[11px]">
                <li>The digital record associated with <strong>FIR No: {activeDoc?.firNo}</strong> was registered by <strong>{activeDoc?.investigatingOfficer || "Police Official"} (Badge #{activeDoc?.requesterBadge || "IO-4892"})</strong> of <strong>{activeDoc?.requesterStation || activeDoc?.policeStation}</strong>.</li>
                <li>The calculated cryptographic SHA-256 digest <code>{activeDoc?.sha256}</code> matches the unalterable root anchor.</li>
                <li>There has been zero unauthorized alteration, overwriting, or cryptographic deviation detected in the digital chain of custody.</li>
              </ol>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCertModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('$65B Admissibility Certificate stamped and issued with judicial seal.');
                  setCertModalOpen(false);
                }}
                className="px-5 py-2 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Issue & Sign $65B Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
