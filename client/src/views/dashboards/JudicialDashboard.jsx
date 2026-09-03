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
  UploadCloud,
  FileCheck,
  FolderArchive,
  Award,
  ShieldCheck
} from 'lucide-react';
import AshokaEmblem from '../../components/AshokaEmblem';
import { translations } from '../../i18n/translations';
import DragDropUploader from '../../components/DragDropUploader';
import { useToast } from '../../context/ToastContext';

export default function JudicialDashboard({ 
  documents = [], 
  metrics, 
  onSelectDocument, 
  onOpenQuorum, 
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

  const [droppedOrder, setDroppedOrder] = useState(null);
  const [orderType, setOrderType] = useState('COURT_ORDER');

  const handleRunHashVerification = (simulatedTamper = false) => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (simulatedTamper) {
        setVerificationResult('MISMATCH');
        toast.error('Cryptographic Mismatch: Document has been altered!');
      } else {
        setVerificationResult('MATCH');
        toast.success('SHA-256 Digest Confirmed: Docket Intact');
      }
    }, 450);
  };

  const handleIngestCourtOrder = () => {
    if (!droppedOrder) return;
    toast.success(`Court filing ${droppedOrder.name} attached with digest ${droppedOrder.sha256.substring(0, 16)}...`);
    setDroppedOrder(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-[#4FA8E0] shadow-xs">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-serif">
                {t.cardJudicialTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 dark:bg-sky-950 text-[#4FA8E0] border border-sky-300 dark:border-sky-800">
                Court Docket Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Presiding Officer: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Jurisdiction: <span className="text-[#4FA8E0] font-semibold">{activeUser?.court || "Patiala House Courts, New Delhi"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCertModalOpen(true)}
          className="px-5 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{t.judicialWidgetCertBtn}</span>
        </button>
      </div>

      {/* VIEW: ORDERS & WARRANTS INGESTION */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Judicial Order & Warrant Ingestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Seal court orders, bail dispositions, or search warrants with judicial timestamp
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {['COURT_ORDER', 'BAIL_DISPOSITION', 'SEARCH_WARRANT'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === type
                      ? 'bg-[#4FA8E0] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <DragDropUploader
            onFileSelect={setDroppedOrder}
            label="Drag & Drop Judicial Order, Warrant Docket or Bail Disposition"
            hint="Supports Signed PDF, TIFF, DOCX with immediate cryptographic SHA-256 seal"
            roleColor="#4FA8E0"
          />

          {droppedOrder && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleIngestCourtOrder}
                className="px-5 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Affix Judicial Seal & Lock Order</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: HASH VERIFICATION TOOL */}
      {activeTab === 'verify' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#4FA8E0]" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {t.judicialWidgetHashTool}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.judicialWidgetHashDesc}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#4FA8E0] font-bold bg-sky-50 dark:bg-sky-950 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              BSA §63 Standard
            </span>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Case Dossier for Integrity Scrutiny</label>
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
                <span>{isVerifying ? 'Comparing Digests...' : t.verifyHashBtn}</span>
              </button>

              <button
                onClick={() => handleRunHashVerification(true)}
                disabled={isVerifying}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                <span>{t.simulateTamperBtn}</span>
              </button>
            </div>

            {verificationResult === 'MATCH' && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-[#5FA777]" />
                  <span>MATCH — MATHEMATICALLY INTACT</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t.matchSuccess}
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
                  {t.mismatchError}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: SECTION 65B GENERATOR */}
      {activeTab === 'section65b' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Statutory Evidence Certificate
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Section 65B / BSA Section 63 Admissibility Terminal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate court-admissible forensic certificates for electronic records with verified hash integrity
              </p>
            </div>
            <button
              onClick={() => setCertModalOpen(true)}
              className="px-5 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Generate Certificate Preview</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{doc.firNo}</div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.caseTitle}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setCertModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 text-[#4FA8E0] dark:text-sky-300 border border-sky-200 dark:border-slate-600 rounded-xl text-xs font-bold hover:bg-sky-50 transition-colors"
                >
                  Affix Court Seal
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Judicial Scrutiny Queue
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Pending Quorum Decisions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Case records awaiting judicial quorum review and Section 63 BSA compliance sign-off
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-300 dark:border-amber-800">
              {documents.filter(d => d.status === 'PENDING_QUORUM').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {documents.filter(d => d.status === 'PENDING_QUORUM').map(doc => (
              <div key={doc.id} className="p-4 bg-[#FFF9F2] dark:bg-slate-800/60 border border-orange-200 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {doc.firNo}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                      Draft v{doc.draftVersion || '1.1'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{doc.caseTitle}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{doc.incidentSummary}</p>
                </div>

                <button
                  onClick={() => onOpenQuorum(doc)}
                  className="px-4 py-2 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>Cast Judicial Vote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Grid: 3 Metric Cards with Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Scrutinized Cases
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-[#4FA8E0] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {documents.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Active court dockets with sealed evidentiary chains
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  §65B Certificates Ready
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#5FA777] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                100%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automated legal compliance with BSA Section 63
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quorum Reviews Pending
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {documents.filter(d => d.status === 'PENDING_QUORUM').length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Amendments requiring judicial review casting
              </p>
            </div>

          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Judicial Jurisdiction Summary</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              As Presiding Magistrate under Section 63 BSA 2023, you have direct jurisdiction over evidentiary exhibits submitted by law enforcement. Select <strong>SHA-256 Hash Verification</strong> to test physical-to-digital parity, or open <strong>Admissibility Generator</strong> to issue certified courtroom trial warrants.
            </p>
          </div>
        </div>
      )}

      {/* §65B Certificate Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <AshokaEmblem className="w-12 h-12 mx-auto text-slate-800 dark:text-slate-200" />
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                CERTIFICATE UNDER SECTION 63, BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
              </div>
              <div className="text-[10px] text-slate-500 font-serif">
                (Formerly Section 65B(4), Indian Evidence Act, 1872)
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              <p>
                I, <strong>{activeUser?.name}</strong>, Presiding Judicial Officer at <strong>{activeUser?.court || "Patiala House Courts, New Delhi"}</strong>, hereby certify that:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-[11px]">
                <li>The digital record associated with <strong>FIR No: {activeDoc?.firNo}</strong> was produced by automated cryptographic software during its lawful operation.</li>
                <li>The calculated SHA-256 checksum <code>{activeDoc?.sha256}</code> matches the root anchor in the append-only WORM ledger.</li>
                <li>There has been zero unauthorized interference or cryptographic deviation detected in the chain of custody.</li>
              </ol>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCertModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Certificate stamped and downloaded for court submission.');
                  setCertModalOpen(false);
                }}
                className="px-5 py-2 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print & Issue Judicial Seal</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
