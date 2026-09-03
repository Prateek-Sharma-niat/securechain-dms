import React, { useState } from 'react';
import { 
  Shield, 
  FolderArchive, 
  FileEdit, 
  Clock, 
  CheckCircle2, 
  UploadCloud, 
  GitBranch, 
  Bell, 
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  FileCheck,
  Hash,
  Database,
  Layers,
  Activity
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import DragDropUploader from '../../components/DragDropUploader';
import { useToast } from '../../context/ToastContext';

export default function PoliceDashboard({ 
  documents = [], 
  metrics, 
  onSelectDocument, 
  onOpenUpload, 
  onOpenQuorum, 
  onGoToChain,
  activeUser,
  activeTab = 'overview',
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();
  const [droppedFile, setDroppedFile] = useState(null);
  const [exhibitType, setExhibitType] = useState('FIR_DOCKET');

  const myCases = documents;
  const pendingRequests = documents.filter(d => d.status === 'PENDING_QUORUM');

  const custodyEvents = [
    { step: "Seizure Memo Form No. 24", time: "14/08/2024 10:45", actor: "Police Official (Investigating Officer)", status: "Completed" },
    { step: "Initial Formal FIR Sealing", time: "14/08/2024 11:00", actor: "Special Investigation Division PS", status: "Sealed (v1.0)" },
    { step: "Forensic Mirror Extraction", time: "15/08/2024 14:20", actor: "Forensic Officer (Scientific Examiner)", status: "Exhibits Locked" },
    { step: "Supplementary Draft Update", time: "21/08/2024 09:15", actor: "Police Official (Investigating Officer)", status: "Under Review" }
  ];

  const handleIngestDroppedFile = () => {
    if (!droppedFile) return;
    toast.success(`File ${droppedFile.name} successfully registered with digest ${droppedFile.sha256.substring(0, 16)}...`);
    setDroppedFile(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 flex items-center justify-center text-[#FF6A1A] shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {t.cardPoliceTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-300 dark:border-orange-800">
                Official Police Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Investigating Cadre: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Station: <span className="text-[#FF6A1A] font-semibold">{activeUser?.policeStation || "Special Investigation Division PS, Mandir Marg"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>+ Register Formal FIR Docket</span>
        </button>
      </div>

      {/* VIEW 1: DRAG & DROP INGESTION (FOCUSED) */}
      {activeTab === 'ingest' && (
        <div className="bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Direct Police Evidence & FIR Drag-and-Drop Ingestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Attach original case files, seizure memos, or supplementary notes directly into the docket
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['FIR_DOCKET', 'SEIZURE_MEMO', 'PANCHNAMA', 'EXHIBIT_PHOTO'].map(t => (
                <button
                  key={t}
                  onClick={() => setExhibitType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    exhibitType === t 
                      ? 'bg-[#FF6A1A] text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <DragDropUploader
            onFileSelect={setDroppedFile}
            label="Drag & Drop Scanned FIR Document or Physical Exhibit Dossier"
            hint="Supports PDF, TIFF, PNG, DOCX, ZIP up to 50MB with instant SHA-256 calculation"
          />

          {droppedFile && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleIngestDroppedFile}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FF6A1A] to-[#FF8C42] hover:from-[#E85B0E] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ingest & Seal File into Evidence Vault</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: M-of-N QUORUM CONSENSUS APPROVALS (FOCUSED) */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Rule 12 Multi-Officer Consensus
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Active Quorum Review Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supplementary edits awaiting 2-of-3 multi-cadre independent officer verification
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-300 dark:border-amber-800">
              {pendingRequests.length} Active Session
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No pending quorum sessions requiring approval at this time.
            </div>
          ) : (
            pendingRequests.map(doc => (
              <div key={doc.id} className="bg-[#FFF9F2] dark:bg-slate-800/60 border border-orange-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{doc.firNo}</span>
                    <span className="text-xs text-[#FF6A1A] font-bold">Draft Version {doc.draftVersion || '1.1'}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.caseTitle}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{doc.incidentSummary}</p>
                </div>

                <button
                  onClick={() => onOpenQuorum(doc)}
                  className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>Review & Cast Vote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 3: OVERVIEW / KPI STATS (FOCUSED) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Grid: 3 Metric Cards with Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Widget 1: My Active Cases */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.policeWidgetActiveCases}
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950 text-[#FF6A1A] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderArchive className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {myCases.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assigned investigation dockets under CrPC Section 154
              </p>
            </div>

            {/* Widget 2: Evidence Uploaded */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Evidence Exhibits Sealed
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#5FA777] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                18
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cryptographically sealed electronic & document records
              </p>
            </div>

            {/* Widget 3: Pending Edit Requests */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.policeWidgetPendingEdits}
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {pendingRequests.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supplementary reports awaiting independent quorum approval
              </p>
            </div>

          </div>

          {/* Custody Tracker Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-[#FF6A1A]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.policeWidgetCustodyTracker}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#5FA777] font-bold bg-[#5FA777]/10 px-2 py-0.5 rounded border border-[#5FA777]/30">
                Chain Intact
              </span>
            </div>

            <div className="space-y-3">
              {custodyEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#FF6A1A] mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{evt.step}</div>
                    <div className="text-[10px] text-slate-400">{evt.actor}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400">{evt.time}</span>
                    <span className="block text-[10px] font-bold text-[#5FA777]">{evt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
