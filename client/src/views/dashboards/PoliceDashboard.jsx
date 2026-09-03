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
  Hash
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
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();
  const [droppedFile, setDroppedFile] = useState(null);
  const [showDirectUpload, setShowDirectUpload] = useState(false);

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
    setShowDirectUpload(false);
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDirectUpload(!showDirectUpload)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-[#FF6A1A]" />
            <span>{showDirectUpload ? 'Hide Drop Zone' : 'Drag & Drop Ingestion'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>+ Register Formal FIR Docket</span>
          </button>
        </div>
      </div>

      {/* Direct Drag & Drop Upload Section (if toggled) */}
      {showDirectUpload && (
        <div className="bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Direct Police Evidence & FIR Drag-and-Drop Ingestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attach case files, seizure memos, or supplementary notes directly into the docket
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              CrPC §154 Certified
            </span>
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

      {/* Grid: Custody Tracker & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 4: Chain of Custody Tracker (Mini Timeline) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#FF6A1A]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t.policeWidgetCustodyTracker}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              FIR-2024-MH-1920
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.policeWidgetCustodyDesc}
          </p>

          <div className="relative pl-6 space-y-5 border-l-2 border-orange-200 dark:border-orange-900 ml-2 pt-2">
            {custodyEvents.map((evt, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-[#FF6A1A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]"></div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{evt.step}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Custodian: <span className="text-slate-700 dark:text-slate-300 font-medium">{evt.actor}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">{evt.time}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-300 dark:border-orange-800">
                      {evt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 5: Notification Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t.policeNotificationTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold">
              1 Active
            </span>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">FIR-2024-MH-1920</span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">v1.1 Draft</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Your supplementary amendment requires supervisory approval before being locked to the head record.
            </p>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
              Quorum Status: <strong>1 of 2 Approvals Cast</strong>
            </div>

            <button
              onClick={() => {
                const pendingDoc = documents.find(d => d.id === 'FIR-2024-MH-1920') || documents[0];
                onOpenQuorum(pendingDoc);
              }}
              className="w-full mt-2 py-2 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View Quorum Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
