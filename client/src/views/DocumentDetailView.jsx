import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Clock, 
  FileEdit, 
  Copy, 
  Check, 
  Hash, 
  ChevronRight, 
  FileCheck2, 
  ShieldCheck, 
  GitBranch, 
  AlertTriangle,
  Printer,
  Calendar,
  Building2,
  User,
  Layers
} from 'lucide-react';
import AshokaEmblem from '../components/AshokaEmblem';
import { translations } from '../i18n/translations';

/**
 * Split-View Document Detail Viewer
 * Left Pane: Mini case dockets list
 * Right Pane: Authentic Indian First Information Report (CrPC Section 154 / BNSS Section 173)
 * - Serif font, thin black border, centered Ashoka Stambh silhouette at top
 * - 14-point structured official FIR sections printed with traditional bilingual labels
 * - Sticky bar with copyable hash, version badge, and amber "Request Edit / Add Update" button
 * - Clicking Request Edit instantly activates "🔴 PENDING QUORUM" banner with zero delay
 */
export default function DocumentDetailView({ 
  document: initialDoc, 
  allDocuments = [], 
  onSelectDocument, 
  onRequestEdit, 
  onOpenQuorum, 
  activeUser, 
  onBackToDashboard,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const [selectedDoc, setSelectedDoc] = useState(initialDoc);
  const [copiedHash, setCopiedHash] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSummary, setEditSummary] = useState('');
  const [editSections, setEditSections] = useState('Section 120B / 468 IPC');
  const [additionalFacts, setAdditionalFacts] = useState('');

  // Update selected doc if parent prop changes
  React.useEffect(() => {
    setSelectedDoc(initialDoc);
  }, [initialDoc]);

  const handleCopyHash = () => {
    if (selectedDoc?.sha256) {
      navigator.clipboard.writeText(selectedDoc.sha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleTriggerEdit = () => {
    setEditModalOpen(true);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editSummary.trim()) {
      alert("Please provide an amendment rationale summary.");
      return;
    }

    // Submit edit request
    onRequestEdit(selectedDoc.id, {
      title: "Supplementary Investigation Report",
      editSummary,
      editSections,
      additionalFacts
    });

    setEditModalOpen(false);
  };

  const isLocked = selectedDoc.status === 'LOCKED';
  const isPending = selectedDoc.status === 'PENDING_QUORUM';

  return (
    <div className="flex-1 bg-[#FFF9F2] flex flex-col min-h-[calc(100vh-140px)] select-none">
      
      {/* Top Breadcrumb & Quick Action Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-600 hover:text-[#FF6A1A] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Case Records'}</span>
        </button>

        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono text-slate-500">
            DOCKET: <strong className="text-slate-900">{selectedDoc.id}</strong>
          </span>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            title="Print Official FIR Form"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split-View Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* ================= LEFT PANE: MINI CASE LIST ================= */}
        <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-4 space-y-3 overflow-y-auto flex-shrink-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Active Docket Files ({allDocuments.length})
          </div>

          <div className="space-y-2">
            {allDocuments.map((d) => {
              const isSelected = d.id === selectedDoc.id;
              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDocument(d)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50/80 border-[#FF6A1A] shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">{d.firNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      d.status === 'LOCKED' ? 'bg-emerald-100 text-[#307044]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status === 'LOCKED' ? 'LOCKED' : 'PENDING'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{d.caseTitle}</h4>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{d.year}</span>
                    <span>v{d.currentVersion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ================= RIGHT PANE: REAL INDIAN FIR FORM CrPC 154 ================= */}
        <section className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
          
          {/* INSTANT RED / AMBER BANNER WHEN PENDING QUORUM */}
          {isPending && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-red-700">
                    <span>🔴 PENDING QUORUM</span>
                    <span>— Supplementary Amendment Draft Active (v{selectedDoc.draftVersion || '1.1'})</span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    An amendment has been submitted for this case. It is awaiting multi-officer consensus before committing to the head record.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenQuorum(selectedDoc)}
                className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Open Quorum Board</span>
              </button>
            </div>
          )}

          {/* Sticky Cryptographic Action Bar (App UI Font, Not Serif) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
            
            {/* Hash Fingerprint */}
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-slate-100 text-[#4FA8E0]">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  SHA-256 Ledger Seal
                </div>
                <div className="font-mono text-xs text-[#000080] font-semibold flex items-center gap-2">
                  <span>{selectedDoc.sha256 ? `${selectedDoc.sha256.substring(0, 24)}...` : '3d5f8a0e889c2b4c10294e77da1b1c3e...'}</span>
                  <button 
                    onClick={handleCopyHash} 
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Copy full 64-character hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-[#5FA777]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Version Badge & Amber "Request Edit" Button */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                isLocked 
                  ? 'bg-emerald-50 text-[#307044] border-emerald-300' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {isLocked ? <Lock className="w-3.5 h-3.5 text-[#5FA777]" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                <span>Version {selectedDoc.currentVersion} — {selectedDoc.status}</span>
              </span>

              {/* Amber "Request Edit / Add Update" Button */}
              {isLocked && (
                <button
                  onClick={handleTriggerEdit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Request Edit / Add Update</span>
                </button>
              )}
            </div>

          </div>

          {/* OFFICIAL REAL INDIAN FIR FORM (FORM NO. 24.5(1) CrPC 154 / BNSS 173) */}
          <div className="bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-md relative watermark-emblem font-serif text-slate-900 leading-relaxed text-xs sm:text-sm">
            
            {/* Header: Centered Ashoka Stambh Silhouette */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5 mb-6">
              <AshokaEmblem className="w-14 h-18 mx-auto mb-1" color="#000000" />
              
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
                FIRST INFORMATION REPORT / प्रथम सूचना रिपोर्ट
              </h2>
              <p className="text-xs font-semibold italic">
                (Under Section 154 Cr.P.C. / धारा 154 दंड प्रक्रिया संहिता एवं धारा 173 BNSS)
              </p>
              
              {/* Form Metadata Header Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 text-xs border-t border-slate-400 mt-2 font-mono">
                <div><strong>District / जिला:</strong> {selectedDoc.district || "New Delhi"}</div>
                <div><strong>P.S. / थाना:</strong> {selectedDoc.policeStation?.split(',')[0]}</div>
                <div><strong>Year / वर्ष:</strong> {selectedDoc.year || "2024"}</div>
                <div><strong>FIR No. / प्र.सू.सं.:</strong> {selectedDoc.firNo}</div>
                <div><strong>Date / तिथि:</strong> {new Date(selectedDoc.dateReported).toLocaleDateString()}</div>
              </div>
            </div>

            {/* 14 Numbered Standard Form Fields Field-For-Field */}
            <div className="space-y-4">
              
              {/* 1. Acts & Sections */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">1. Acts & Sections / अधिनियम एवं धाराएं:</span>
                <span className="ml-2 font-mono text-xs font-semibold text-slate-800">
                  {selectedDoc.actsAndSections}
                </span>
              </div>

              {/* 2. Occurrence of Offence */}
              <div className="border-b border-slate-300 pb-2 space-y-1">
                <span className="font-bold block">2. Occurrence of Offence / अपराध की घटना:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pl-4">
                  <div><strong>(a) Day/Date/Time:</strong> {selectedDoc.occurrenceDate || "14/08/2024"}</div>
                  <div><strong>(b) Info received at P.S.:</strong> {new Date(selectedDoc.dateReported).toLocaleTimeString()}</div>
                  <div><strong>(c) General Diary Ref:</strong> GD No. 24A at 10:15 IST</div>
                </div>
              </div>

              {/* 3. Type of Information */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">3. Type of Information / सूचना का प्रकार:</span>
                <span className="ml-2">{selectedDoc.typeOfInformation || "Written Official Report"}</span>
              </div>

              {/* 4. Place of Occurrence */}
              <div className="border-b border-slate-300 pb-2 space-y-1">
                <span className="font-bold block">4. Place of Occurrence / घटनास्थल:</span>
                <div className="text-xs pl-4 space-y-0.5">
                  <div><strong>(a) Direction & distance from P.S.:</strong> 4.2 KM West from Station</div>
                  <div><strong>(b) Address / पता:</strong> {selectedDoc.placeOfOccurrence || "Corporate Banking Division, Central Sector"}</div>
                </div>
              </div>

              {/* 5. Complainant / Informant */}
              <div className="border-b border-slate-300 pb-2 space-y-1">
                <span className="font-bold block">5. Complainant / Informant / शिकायतकर्ता:</span>
                <div className="text-xs pl-4">
                  <strong>Name & Particulars:</strong> {selectedDoc.complainant}
                </div>
              </div>

              {/* 6. Accused Details */}
              <div className="border-b border-slate-300 pb-2 space-y-1">
                <span className="font-bold block">6. Details of Known / Suspected / Unknown Accused / अभियुक्त का विवरण:</span>
                <div className="text-xs pl-4 font-mono font-medium">
                  {selectedDoc.accused}
                </div>
              </div>

              {/* 7. Delay Reasons */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">7. Reasons for delay in reporting / विलंब का कारण:</span>
                <span className="ml-2 text-xs">{selectedDoc.delayReasons || "None"}</span>
              </div>

              {/* 8. Properties Involved */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">8. Particulars of properties involved / संपत्ति का विवरण:</span>
                <span className="ml-2 text-xs">{selectedDoc.propertiesInvolved || "Forensic hardware exhibits and documentation"}</span>
              </div>

              {/* 9. Total Value */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">9. Total value of properties stolen / involved / कुल मूल्य:</span>
                <span className="ml-2 text-xs font-mono font-bold text-[#FF6A1A]">{selectedDoc.stolenValue || "Under audit assessment"}</span>
              </div>

              {/* 10. Inquest Report */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">10. Inquest Report / U.D. Case No., if any / मृत्यु समीक्षा रिपोर्ट:</span>
                <span className="ml-2 text-xs font-mono">{selectedDoc.inquestNo || "N/A"}</span>
              </div>

              {/* 11. FIR Narrative Contents */}
              <div className="border-b border-slate-300 pb-3 space-y-1.5">
                <span className="font-bold block">11. F.I.R. Contents (Statement of facts) / प्रथम सूचना रिपोर्ट के तथ्य:</span>
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs whitespace-pre-line leading-relaxed font-sans text-slate-800">
                  {selectedDoc.incidentSummary}
                </div>
              </div>

              {/* 12. Action Taken */}
              <div className="border-b border-slate-300 pb-2">
                <span className="font-bold">12. Action Taken / की गई कार्रवाई:</span>
                <span className="ml-2 text-xs">{selectedDoc.actionTaken || "Case registered and investigation initiated under Section 154 CrPC."}</span>
              </div>

              {/* 13 & 14 Signatures & Dispatch */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                
                {/* 13. Complainant Signature */}
                <div className="border p-3 rounded-xl border-slate-300 bg-slate-50 text-center space-y-4">
                  <span className="font-bold block text-[11px]">13. Signature / Thumb Impression of Informant:</span>
                  <div className="h-8 flex items-center justify-center font-mono italic text-slate-500 text-xs">
                    [Digitally Sealed / e-Sign Verified]
                  </div>
                </div>

                {/* 14. Officer in Charge Signature (Generic Role Title ONLY) */}
                <div className="border p-3 rounded-xl border-slate-300 bg-slate-50 text-center space-y-2">
                  <span className="font-bold block text-[11px]">14. Signature of Officer in Charge / थाना प्रभारी:</span>
                  <div className="text-xs space-y-0.5">
                    <div>Name: <strong>Police Official (Investigating Officer)</strong></div>
                    <div>Rank: <strong>Sub-Inspector</strong> • No: <strong>DL-4892</strong></div>
                    <div className="text-[10px] text-slate-500 font-mono">Dispatched to Court: Same Day 17:00 IST</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* ================= EDIT REQUEST MODAL ================= */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Request Supplementary Amendment (CrPC 173(8))
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitting this update creates Draft v{parseFloat(selectedDoc.currentVersion || 1.0) + 0.1}. It requires 2-of-3 quorum consensus.
              </p>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amendment Summary Rationale
                </label>
                <textarea
                  rows={3}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  placeholder="e.g. Addition of Section 121A IPC following forensic confirmation of state-backed C2 endpoints..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicable Statutory Sections
                </label>
                <input
                  type="text"
                  value={editSections}
                  onChange={(e) => setEditSections(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3 bg-orange-50 rounded-xl text-[11px] text-orange-900 border border-orange-200">
                <strong>Rule 4B Enforcement:</strong> As the requesting officer, your account cannot vote to approve this amendment. Two other independent supervisory reviewers must vote to confirm consensus.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6A1A] hover:bg-[#E85B0E] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Submit for Quorum Approval
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
