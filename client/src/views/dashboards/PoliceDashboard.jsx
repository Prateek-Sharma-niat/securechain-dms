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
  Layers, 
  Activity,
  User,
  Settings as SettingsIcon,
  Eye,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import DragDropUploader from '../../components/DragDropUploader';
import { useToast } from '../../context/ToastContext';

/**
 * Police Dashboard per Master Spec Section 7 & 20.4:
 * - Dedicated saffron accent sidebar: Home, My Cases, Upload New FIR, My Edit Requests, Chain of Custody, Notifications, Settings
 * - Scoped strictly to FIRs only (Section 20.4)
 * - Drag-and-drop upload zone leading into OCR Review step
 * - My Edit Requests with status chips (Pending Quorum / Approved / Rejected)
 * - Chain of Custody mini timeline (plain language, no raw hashes)
 * - NO audit log link anywhere
 */
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

  // Filter cases assigned to this officer or general station cases
  const myCases = documents;
  const pendingRequests = documents.filter(d => d.status === 'PENDING_QUORUM');

  const custodyEvents = [
    { step: "Seizure Memo Form No. 24 Issued", time: "14/08/2024 10:45 IST", actor: "Police Official (Investigating Officer)", status: "Completed" },
    { step: "Initial Formal FIR Sealing", time: "14/08/2024 11:00 IST", actor: "Special Investigation Division PS", status: "Sealed (v1.0)" },
    { step: "Physical Exhibits Transferred to Lab", time: "15/08/2024 14:20 IST", actor: "Forensic Officer (Scientific Examiner)", status: "Exhibits Received" },
    { step: "Supplementary Draft Update Submitted", time: "21/08/2024 09:15 IST", actor: "Police Official (Investigating Officer)", status: "Under Review" }
  ];

  const handleProceedToOcr = () => {
    if (!droppedFile) return;
    if (onOpenUpload) {
      onOpenUpload();
    } else {
      toast.info(`Proceeding to OCR text verification for ${droppedFile.name}...`);
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors w-full">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 flex items-center justify-center text-[#FF6A1A] shadow-xs flex-shrink-0">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-serif">
                Police / Investigating Officer Terminal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-200 dark:border-orange-800">
                Law Enforcement Cadre
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Investigating Officer: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Station: <span className="text-[#FF6A1A] font-semibold">{activeUser?.policeStation || "Special Investigation Division PS, Mandir Marg"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 sm:px-5 py-2.5 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <FileText className="w-4 h-4" />
          <span>+ Register New FIR</span>
        </button>
      </div>

      {/* VIEW 1: UPLOAD NEW FIR (Section 7 & 20.4) */}
      {activeTab === 'upload' && (
        <div className="bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700/60 rounded-3xl p-4 sm:p-8 shadow-sm space-y-5 animate-in fade-in w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950 text-[#FF6A1A] border border-orange-200 dark:border-orange-800">
                FIR Ingestion Gateway
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-serif">
                Upload New FIR (CrPC Section 154 / BNSS Section 173)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                Drag and drop scanned FIR dockets. Leads directly into human-in-the-loop OCR review before cryptographic sealing.
              </p>
            </div>
          </div>

          <DragDropUploader
            onFileSelect={setDroppedFile}
            label="Drag & Drop Scanned FIR Document or Case Diary"
            hint="Supports PDF, TIFF, PNG up to 50MB (AES-256 encrypted at rest)"
            roleColor="#FF6A1A"
          />

          {droppedFile && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-slate-100">Ready for OCR Text Extraction:</div>
                <div className="font-mono text-[11px] text-slate-500">{droppedFile.name} ({(droppedFile.size / 1024 / 1024).toFixed(2)} MB)</div>
              </div>

              <button
                onClick={handleProceedToOcr}
                className="px-5 py-2.5 bg-[#FF6A1A] hover:bg-[#e05910] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>Proceed to OCR Review Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY CASES */}
      {activeTab === 'cases' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                Assigned Case Records & Active Investigations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                List of FIRs registered under your investigating jurisdiction
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{myCases.length} Records</span>
          </div>

          <div className="space-y-3">
            {myCases.map(doc => (
              <div 
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-orange-300 dark:hover:border-orange-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {doc.firNo}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      v{doc.currentVersion} Locked
                    </span>
                    {doc.status === 'PENDING_QUORUM' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Draft Pending Review
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                    {doc.caseTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    Acts: <strong>{doc.actsAndSections}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDocument && onSelectDocument(doc)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View FIR</span>
                  </button>
                  <button
                    onClick={() => onSelectDocument && onSelectDocument(doc)}
                    className="px-3.5 py-1.5 bg-orange-50 dark:bg-orange-950 text-[#FF6A1A] hover:bg-orange-100 text-xs font-bold rounded-xl border border-orange-200 dark:border-orange-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Request Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: MY EDIT REQUESTS */}
      {activeTab === 'edits' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                My Amendment & Supplementary Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Status chips tracking your requested changes through independent peer quorum
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingRequests.map(doc => (
              <div 
                key={doc.id}
                className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {doc.firNo}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Draft v{doc.draftVersion || '1.1'}
                    </span>
                  </div>

                  {/* Status Chips */}
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      🔴 Pending Quorum
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Self-Approval Blocked
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{doc.caseTitle}</div>
                  <p className="leading-relaxed">
                    {doc.draftData?.editSummary || doc.versions?.find(v => v.version === doc.draftVersion)?.summaryDiff || "Supplementary findings submitted for peer review."}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                  <span>Routing: <strong>{doc.jurisdictionalPool || "District Police Review Pool"}</strong></span>
                  <span>Awaiting independent peer officer review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: CHAIN OF CUSTODY TIMELINE (Plain Language, No Hashes) */}
      {activeTab === 'custody' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
              Evidence Chain of Custody Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Plain-language custody record tracking who touched the evidence exhibits and when
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            {custodyEvents.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-3.5 relative">
                {idx < custodyEvents.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -ml-px"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/80 border-2 border-[#FF6A1A] flex items-center justify-center text-[#FF6A1A] flex-shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {evt.step}
                    </span>
                    <span className="text-[10px] font-mono text-[#FF6A1A] font-semibold bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded">
                      {evt.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Handled By: <strong>{evt.actor}</strong> • Timestamp: <span className="font-mono">{evt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: OVERVIEW (Default) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Cases Assigned
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950 text-[#FF6A1A] flex items-center justify-center">
                  <FolderArchive className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {myCases.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Active investigation dockets under CrPC Section 154
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pending Edit Requests
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {pendingRequests.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supplementary reports awaiting independent peer review
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Evidence Custody Events
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#5FA777] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                100% Sealed
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Encrypted at rest with automated tamper detection
              </p>
            </div>

          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Activity className="w-4 h-4 text-[#FF6A1A]" />
              <span>Recent Investigation Activity Feed</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <strong>FIR 0842/2024:</strong> Physical MicroSD evidence exhibits verified and locked.
                </div>
                <span className="text-[10px] text-slate-400 font-mono">14 Aug 2024</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <strong>FIR 1920/2024:</strong> Supplementary charge amendment submitted to State Review Pool.
                </div>
                <span className="text-[10px] text-slate-400 font-mono">21 Aug 2024</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
