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
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const toast = useToast();

  const [showDirectUpload, setShowDirectUpload] = useState(false);
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
    setShowDirectUpload(false);
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDirectUpload(!showDirectUpload)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-[#5FA777]" />
            <span>{showDirectUpload ? 'Hide Lab Ingestion' : 'Drag & Drop Exhibit Upload'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 bg-[#5FA777] hover:bg-[#4E9365] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Ingest Forensic Lab Report</span>
          </button>
        </div>
      </div>

      {/* Direct Drag & Drop Upload Section */}
      {showDirectUpload && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Direct Exhibit & Scientific Analysis Drag-and-Drop
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
            Awaiting forensic scientist verification signature
          </p>
        </div>

      </div>

      {/* Grid: OCR Queue + Pending Quorum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Widget 2: OCR / Analysis Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#5FA777]" />
              <span>{t.forensicWidgetOcrQueue}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{ocrQueue.length} Exhibits Ready</span>
          </div>

          <div className="space-y-4">
            {ocrQueue.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-3xl p-6 shadow-xs transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.id}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{item.caseRef}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.sensitivityTier === 'HIGH'
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                  }`}>
                    Sensitivity: {item.sensitivityTier}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                    {item.fileName}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                    <span>Size: <strong className="text-slate-700 dark:text-slate-300">{item.fileSize}</strong></span>
                    <span>OCR Accuracy: <strong className="text-[#307044] dark:text-emerald-400">{item.confidence}</strong></span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Detected Content Entities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.keywordsFound.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-mono text-[10px] text-slate-400">
                    SHA-256: {item.sha256.substring(0, 24)}...
                  </div>

                  <button
                    onClick={() => handleConfirmSeal(item)}
                    className="px-4 py-1.5 bg-[#5FA777] hover:bg-[#4E9365] text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t.confirmAndSealBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Widget 4: Pending Quorum Reviews */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5FA777]" />
                <span>{t.forensicWidgetPendingQuorum}</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold">
                {pendingQuorums.length} Active
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Technical quorum review queue. Pseudonymous requester IDs are used for independent impartiality:
            </p>

            {pendingQuorums.map((doc) => (
              <div key={doc.id} className="p-4 bg-[#F4FAF6] dark:bg-slate-800/60 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{doc.firNo}</span>
                  <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    Req: Officer_DL94
                  </span>
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{doc.caseTitle}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{doc.incidentSummary}</p>

                <button
                  onClick={() => onOpenQuorum(doc)}
                  className="w-full py-2 bg-[#5FA777] hover:bg-[#4E9365] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 shadow-xs"
                >
                  <span>Cast Technical Review Vote</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Widget 3: Evidence Sample Chain of Custody Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#5FA777]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t.forensicWidgetSampleCustody}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full font-bold">
            Rule 12 Certified Safe
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleCustodyList.map((sample, i) => (
            <div key={i} className="p-4 bg-[#FFF9F2] dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{sample.sampleId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-[#307044] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {sample.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">{sample.item}</h4>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>Tamper Seal: <strong className="text-orange-700 dark:text-orange-400 font-mono">{sample.tamperBagSeal}</strong></div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{sample.storageCondition}</span>
                </div>
                <div>Designated Custodian: <span className="text-slate-800 dark:text-slate-200 font-medium">{sample.custodian}</span></div>
                <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">SHA-256: {sample.hash}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
