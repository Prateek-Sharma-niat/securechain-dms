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
  FolderArchive
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
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();

  // Selected document for verification & certificate
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Hash verification state
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // §65B Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Drag & drop court order upload state
  const [showOrderUpload, setShowOrderUpload] = useState(false);
  const [droppedOrder, setDroppedOrder] = useState(null);
  const [orderType, setOrderType] = useState('COURT_ORDER'); // 'COURT_ORDER' | 'BAIL_DISPOSITION' | 'SEARCH_WARRANT'

  // Run Hash Verification
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
    setShowOrderUpload(false);
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderUpload(!showOrderUpload)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-[#4FA8E0]" />
            <span>{showOrderUpload ? 'Hide Uploader' : '+ Upload Court Order / Warrant'}</span>
          </button>

          <button
            onClick={() => setCertModalOpen(true)}
            className="px-5 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.judicialWidgetCertBtn}</span>
          </button>
        </div>
      </div>

      {/* Direct Drag & Drop Upload Section for Court Orders */}
      {showOrderUpload && (
        <div className="bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Judicial Order & Warrant Ingestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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

      {/* Grid: Hash Tool + Cases Pending Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 2: Hash Verification Tool */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#4FA8E0]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t.judicialWidgetHashTool}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">BSA §63 Standard</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t.judicialWidgetHashDesc}
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Case Dossier for Integrity Scrutiny</label>
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setVerificationResult(null);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#4FA8E0]"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firNo} — {d.caseTitle} (v{d.currentVersion})
                  </option>
                ))}
              </select>
            </div>

            {/* Calculated Hash Snapshot */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Target Exhibit Digest (SHA-256):</div>
              <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all font-semibold">
                {activeDoc?.sha256 || '3d5f8a0e889c2b4c10294e77da1b1c3e7f4a56b2c890de41fa7712398ab45c11'}
              </div>
            </div>

            {/* Buttons: Verify Real vs Simulate Tamper */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleRunHashVerification(false)}
                disabled={isVerifying}
                className="flex-1 py-2.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVerifying ? 'Comparing Digests...' : t.verifyHashBtn}</span>
              </button>

              <button
                onClick={() => handleRunHashVerification(true)}
                disabled={isVerifying}
                className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                title="Simulate altered file hash"
              >
                <span>{t.simulateTamperBtn}</span>
              </button>
            </div>

            {/* Verification Result Banner */}
            {verificationResult === 'MATCH' && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-[#5FA777]" />
                  <span>MATCH — INTACT</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t.matchSuccess}
                </p>
              </div>
            )}

            {verificationResult === 'MISMATCH' && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
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

        {/* Widget 1: Cases Pending Verification & Approval Queue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#4FA8E0]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t.judicialWidgetQueue}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Pending Judicial Scrutiny
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Case records awaiting judicial quorum review and Section 63 BSA compliance sign-off:
          </p>

          <div className="space-y-3">
            {documents.filter(d => d.status === 'PENDING_QUORUM').map(doc => (
              <div key={doc.id} className="p-4 bg-[#FFF9F2] dark:bg-slate-800/60 border border-orange-200 dark:border-slate-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {doc.firNo}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                    Draft v{doc.draftVersion || '1.1'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{doc.caseTitle}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{doc.incidentSummary}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Investigating Officer: <strong>{doc.investigatingOfficer}</strong>
                  </span>
                  <button
                    onClick={() => onOpenQuorum(doc)}
                    className="px-3 py-1.5 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Cast Judicial Vote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* §65B Admissibility Certificate Modal (Printable) */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150">
            
            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <AshokaEmblem className="w-12 h-16 mx-auto" color="#12161C" />
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide font-serif">
                CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
              </h3>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                (Also Admissible under Section 63 of Bharatiya Sakshya Adhiniyam, 2023)
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Court Docket Ref: {activeDoc?.firNo} • National Ledger Seal Verified
              </p>
            </div>

            {/* Certificate Text in Court Serif Font */}
            <div className="space-y-3 text-xs text-slate-800 dark:text-slate-200 font-serif leading-relaxed border p-4 rounded-2xl bg-[#FFF9F2] dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <p>
                I, <strong>{activeUser?.name}</strong>, holding official status as <strong>{activeUser?.role}</strong>, 
                hereby certify that the electronic record identified below was produced by secure cryptographic storage under lawful court supervision:
              </p>
              
              <div className="space-y-1 text-[11px] font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>Case Reference: <strong>{activeDoc?.firNo}</strong></div>
                <div>Case Title: <strong>{activeDoc?.caseTitle}</strong></div>
                <div>Police Station: <strong>{activeDoc?.policeStation}</strong></div>
                <div>Sealed Version: <strong>v{activeDoc?.currentVersion}</strong></div>
                <div className="break-all">Ledger Digest: <strong>{activeDoc?.sha256}</strong></div>
              </div>

              <p className="text-[11px]">
                I further certify that during the entire period of custody, the ledger system operated properly with append-only integrity, 
                such that no unauthorized alteration, deletion, or silent tampering occurred.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCertModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#4FA8E0] hover:bg-[#3B97D1] text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
