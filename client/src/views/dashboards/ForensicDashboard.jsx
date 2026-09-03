import React, { useState } from 'react';
import { 
  Microscope, 
  UploadCloud, 
  FileSearch, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  PackageCheck, 
  Lock, 
  Clock, 
  Eye, 
  Hash, 
  Sparkles, 
  Layers, 
  FileText, 
  Tag, 
  ShieldCheck,
  ArrowRight,
  Database
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import DragDropUploader from '../../components/DragDropUploader';
import { useToast } from '../../context/ToastContext';

export default function ForensicDashboard({ 
  documents = [], 
  metrics, 
  onSelectDocument, 
  onOpenUpload, 
  onOpenQuorum, 
  activeUser,
  activeTab = 'overview',
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();

  const [droppedFile, setDroppedFile] = useState(null);

  // Simulated OCR & Content Analysis Queue
  const [ocrQueue, setOcrQueue] = useState([
    {
      id: "OCR-7721",
      fileName: "Mobile_Device_Encrypted_Database_Extract.bin",
      caseRef: "FIR-2024-ND-0842",
      fileSize: "84.2 MB",
      confidence: "99.4%",
      keywordsFound: ["Beneficiary Ledger", "Diverted Accounts", "Routing Metadata"],
      sensitivityTier: "HIGH",
      sha256: "4a2b9918de55c010a394fe77b1029c4e8810aa345b1289de66c10123fa774431",
      status: "ANALYZED_READY"
    },
    {
      id: "OCR-7722",
      fileName: "SCADA_Substation_Bytecode_Capture.raw",
      caseRef: "FIR-2024-MH-1920",
      fileSize: "1.2 GB",
      confidence: "98.1%",
      keywordsFound: ["Command Injection", "Telemetry Corrupt", "Memory Bytecode"],
      sensitivityTier: "HIGH",
      sha256: "a094bb7621cde456881900112aa56e789bc10123ef4512399810a9117bce3210",
      status: "ANALYZED_READY"
    },
    {
      id: "OCR-7723",
      fileName: "Spectrogram_Synthetic_Voice_Acoustic.pdf",
      caseRef: "FIR-2024-KA-0518",
      fileSize: "14.8 MB",
      confidence: "97.6%",
      keywordsFound: ["Synthetic Vocoder", "Frequency Glitch", "Audio Phase Cut"],
      sensitivityTier: "MEDIUM",
      sha256: "77aa9011de54bc3210aa98bc45ef123490bcae115623cd89aa102345bc678912",
      status: "ANALYZED_READY"
    }
  ]);

  const sampleCustodyList = [
    {
      sampleId: "SAMPLE-EX-01",
      item: "Seized MicroSD 256GB SanDisk (Ex-01)",
      tamperBagSeal: "GOI-SEAL-8841-A",
      storageCondition: "ESD Faraday Safe, Anti-Static, 4°C Cold Storage",
      custodian: "Forensic Officer (Scientific Examiner)",
      hash: "3d5f8a0e889c2b4c...ab45c11",
      status: "SEALED_INTACT"
    },
    {
      sampleId: "SAMPLE-EX-02",
      item: "Industrial Gateway SCADA Controller Chip",
      tamperBagSeal: "GOI-SEAL-9912-B",
      storageCondition: "Nitrogen Desiccator Vault, 18°C",
      custodian: "Forensic Officer (Principal Evidence Custodian)",
      hash: "55e41aa902bc4511...fa774431",
      status: "SEALED_INTACT"
    }
  ];

  const pendingQuorums = documents.filter(d => d.status === 'PENDING_QUORUM');

  const handleConfirmSeal = (item) => {
    toast.success(`Exhibit ${item.fileName} sealed with sensitivity [${item.sensitivityTier}]`);
    setOcrQueue(prev => prev.filter(q => q.id !== item.id));
  };

  const handleIngestDroppedLabReport = () => {
    if (!droppedFile) return;
    toast.success(`Lab Report ${droppedFile.name} added with hash ${droppedFile.sha256.substring(0, 16)}...`);
    setOcrQueue(prev => [
      {
        id: `OCR-${Math.floor(1000 + Math.random() * 9000)}`,
        fileName: droppedFile.name,
        caseRef: "FIR-2024-ND-0842",
        fileSize: `${(droppedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        confidence: "99.1%",
        keywordsFound: ["Spectrogram Analysis", "Cryptographic Checksum"],
        sensitivityTier: "HIGH",
        sha256: droppedFile.sha256,
        status: "ANALYZED_READY"
      },
      ...prev
    ]);
    setDroppedFile(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#5FA777] shadow-xs">
            <Microscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {t.cardForensicTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-[#307044] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                FSL Examination Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Scientific Examiner: <strong className="text-slate-800 dark:text-slate-200">{activeUser?.name}</strong> • Unit: <span className="text-[#5FA777] font-semibold">{activeUser?.labUnit || "CFSL New Delhi"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 bg-[#5FA777] hover:bg-[#4E9365] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Ingest Forensic Lab Report</span>
        </button>
      </div>

      {/* VIEW: LAB REPORT & EXTRACTION INGESTION */}
      {activeTab === 'ingest' && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Direct Exhibit & Scientific Analysis Drag-and-Drop
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload raw dumps, bitstream mirrors, spectrograms, or digital toxicology certificates
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ISO/IEC 17025 Compliant
            </span>
          </div>

          <DragDropUploader
            onFileSelect={setDroppedFile}
            label="Drag & Drop Raw Bitstream Dump, Forensic Mirror or Lab Certificate"
            hint="Supports .bin, .raw, .pdf, .e01, .aff, .pcap up to 2GB with high-speed SHA-256 pre-calculation"
            roleColor="#5FA777"
          />

          {droppedFile && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleIngestDroppedLabReport}
                className="px-5 py-2.5 bg-[#5FA777] hover:bg-[#4E9365] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit to Forensic Pipeline & Compute Sensitivity</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: PHYSICAL & DIGITAL CUSTODY SAFE */}
      {activeTab === 'custody' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Physical & Digital Evidence Custody Safe
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ISO/IEC 17025 certified physical sample tracker with tamper-evident serial bag seal anchors
              </p>
            </div>
            <span className="text-xs font-bold text-[#5FA777] bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Storage Active
            </span>
          </div>

          <div className="space-y-4">
            {sampleCustodyList.map((sample) => (
              <div 
                key={sample.sampleId} 
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {sample.sampleId}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      SEAL: {sample.tamperBagSeal}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {sample.item}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                    <span>{sample.storageCondition}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Custodian: <strong>{sample.custodian}</strong>
                  </div>
                </div>

                <div className="text-right space-y-2 flex-shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5FA777]/15 text-[#307044] dark:text-emerald-300 border border-[#5FA777]/40 block text-center">
                    SEAL INTACT
                  </span>
                  <div className="text-[10px] font-mono text-slate-400">
                    Hash: {sample.hash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: OCR PIPELINE & SENSITIVITY CLASSIFICATION */}
      {activeTab === 'ocr' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                OCR & Content Analysis Queue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated character recognition with entity extraction & sensitivity tier assignment
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {ocrQueue.length} In Review
            </span>
          </div>

          <div className="space-y-4">
            {ocrQueue.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                All uploaded extracts have been certified and sealed into the repository.
              </div>
            ) : (
              ocrQueue.map((item) => (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {item.id}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {item.caseRef}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        TIER: {item.sensitivityTier}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Confidence {item.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.fileName} ({item.fileSize})
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.keywordsFound.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-sm">
                      SHA-256: {item.sha256}
                    </div>

                    <button
                      onClick={() => handleConfirmSeal(item)}
                      className="px-4 py-1.5 bg-[#5FA777] hover:bg-[#4E9365] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Lock Exhibit</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW: QUORUM REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Technical Review Board
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Forensic Peer Quorum Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supplementary digital extractions requiring peer technical scrutiny before ledger commitment
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-300 dark:border-amber-800">
              {pendingQuorums.length} In Review
            </span>
          </div>

          <div className="space-y-3">
            {pendingQuorums.map(doc => (
              <div key={doc.id} className="p-4 bg-[#FFF9F2] dark:bg-slate-800/60 border border-orange-200 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {doc.firNo}
                    </span>
                    <span className="text-[10px] font-bold text-[#5FA777]">Draft v{doc.draftVersion || '1.1'}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{doc.caseTitle}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{doc.incidentSummary}</p>
                </div>

                <button
                  onClick={() => onOpenQuorum(doc)}
                  className="px-4 py-2 bg-[#5FA777] hover:bg-[#4E9365] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>Peer Technical Review</span>
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
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Exhibits In Custody
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#5FA777] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PackageCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {sampleCustodyList.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Physical hardware samples sealed in anti-static storage
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Analysis Queue
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSearch className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {ocrQueue.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bitstream extractions ready for final cryptographic seal
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-2 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quorum Reviews
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {pendingQuorums.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Technical addendums awaiting peer examination consensus
              </p>
            </div>

          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Laboratory Custody Standards</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All physical and bitstream exhibits are sealed under ISO/IEC 17025 laboratory guidelines. Choose <strong>Chain of Custody</strong> to inspect storage conditions and tamper bag seals, or <strong>OCR Pipeline</strong> to approve automated entity extractions.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
