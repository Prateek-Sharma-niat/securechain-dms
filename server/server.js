const express = require('express');
const cors = require('cors');
const store = require('./data/store');
const wormAudit = require('./ledger/wormAudit');
const { DEMO_PERSONAS } = require('./data/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* =========================================================
   1. AUTHENTICATION & DEMO PERSONAS
   ========================================================= */

// Get available demo personas for easy UI switching
app.get('/api/personas', (req, res) => {
  const sanitized = DEMO_PERSONAS.map(p => ({
    id: p.id,
    portalRole: p.portalRole || "POLICE",
    name: p.name,
    role: p.role,
    department: p.department,
    badge: p.badge,
    rank: p.rank,
    pseudonym: p.pseudonym,
    avatar: p.avatar,
    canRequestEdit: p.canRequestEdit,
    canApprove: p.canApprove,
    canDeAnonymize: p.canDeAnonymize,
    policeStation: p.policeStation,
    court: p.court,
    labUnit: p.labUnit,
    otp: p.otp
  }));
  res.json({ personas: sanitized });
});

// Login endpoint with Employee ID + OTP (Mock OTP: 123456)
app.post('/api/auth/login', (req, res) => {
  const { employeeId, otp, rolePortal } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: "Employee / Credential ID is required." });
  }

  const cleanId = employeeId.trim().toUpperCase();
  let user = DEMO_PERSONAS.find(p => p.id.trim().toUpperCase() === cleanId || p.badge?.trim().toUpperCase() === cleanId);

  if (!user && rolePortal) {
    user = DEMO_PERSONAS.find(p => p.portalRole === rolePortal);
  } else if (!user) {
    if (cleanId.startsWith('JUD')) user = DEMO_PERSONAS.find(p => p.portalRole === 'JUDICIAL');
    else if (cleanId.startsWith('FSL')) user = DEMO_PERSONAS.find(p => p.portalRole === 'FORENSIC');
    else if (cleanId.startsWith('FOR')) user = DEMO_PERSONAS.find(p => p.portalRole === 'FORENSIC');
    else if (cleanId.startsWith('POL')) user = DEMO_PERSONAS.find(p => p.portalRole === 'POLICE');
  }


  if (!user) {
    return res.status(401).json({ error: `Invalid ID '${employeeId}'. Please select an authorized officer ID.` });
  }

  // Demo OTP validation: accept user.otp or default '123456'
  if (otp && otp !== user.otp && otp !== "123456") {
    return res.status(401).json({ error: "Invalid OTP credentials. Try '123456'." });
  }

  const sessionToken = `SEC-TOKEN-${user.id}-${Date.now()}`;

  wormAudit.append({
    layerNumber: 6,
    layerName: "Layer 6 - Access Control Audit",
    employeeId: user.id,
    role: user.role,
    action: "OFFICER_SESSION_AUTHENTICATED",
    docId: "AUTH_GATE",
    version: user.portalRole,
    beforeHash: null,
    afterHash: sessionToken.substring(0, 32),
    details: { rank: user.rank, department: user.department, portalRole: user.portalRole }
  });

  res.json({
    token: sessionToken,
    user: {
      id: user.id,
      portalRole: user.portalRole,
      name: user.name,
      role: user.role,
      department: user.department,
      badge: user.badge,
      rank: user.rank,
      pseudonym: user.pseudonym,
      avatar: user.avatar,
      canRequestEdit: user.canRequestEdit,
      canApprove: user.canApprove,
      canDeAnonymize: user.canDeAnonymize,
      policeStation: user.policeStation,
      court: user.court,
      labUnit: user.labUnit
    }
  });
});

// De-anonymization Judicial API endpoint (Section 65B Audit Protocol)
app.post('/api/audit/de-anonymize', (req, res) => {
  try {
    const { pseudonym, justification, officerId } = req.body;
    
    if (!pseudonym || !justification) {
      return res.status(400).json({ error: "Both target pseudonym and legal justification are mandatory." });
    }

    const officer = DEMO_PERSONAS.find(p => p.id === officerId) || DEMO_PERSONAS.find(p => p.portalRole === 'JUDICIAL');
    if (!officer || officer.portalRole !== 'JUDICIAL' || !officer.canDeAnonymize) {
      return res.status(403).json({ 
        error: "PERMISSION DENIED: Only authorized Ministry of Home Affairs Statutory Auditors can de-anonymize review officers under statutory audit protocol." 
      });
    }

    const result = wormAudit.deAnonymize(pseudonym, justification, officer);
    const targetPersona = DEMO_PERSONAS.find(p => p.id === result.employeeId);

    res.json({
      success: true,
      message: "De-anonymization disclosure recorded in WORM Audit Ledger.",
      pseudonym: result.pseudonym,
      employeeId: result.employeeId,
      realName: targetPersona ? targetPersona.name : "Officer " + result.employeeId,
      rank: targetPersona ? targetPersona.rank : "Reviewing Authority",
      department: targetPersona ? targetPersona.department : "Law Enforcement Agency",
      justification: result.justification,
      logId: result.logId,
      timestamp: result.timestamp
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================================================
   1B. CITIZEN PORTAL AUTHENTICATION & RECORDS ACCESS
   ========================================================= */

// Citizen Login (by mobile number or ack/FIR number)
app.post('/api/citizen/login', (req, res) => {
  const { mobileNumber, ackNumber, otp } = req.body;

  let citizen = null;

  if (mobileNumber) {
    citizen = Array.from(store.citizens.values()).find(c => c.mobile === mobileNumber.trim());
  } else if (ackNumber) {
    citizen = Array.from(store.citizens.values()).find(
      c => c.ackNumber.toLowerCase() === ackNumber.trim().toLowerCase() ||
           c.linkedCases.some(lc => lc.toLowerCase() === ackNumber.trim().toLowerCase())
    );
  }

  // Fallback demo citizen if testing standard 10-digit number
  if (!citizen && ((mobileNumber && mobileNumber.length >= 10) || (ackNumber && ackNumber.length >= 5))) {
    citizen = store.citizens.get("CIT-001");
  }

  if (!citizen) {
    return res.status(404).json({ error: "No citizen record found with provided details. Please check and try again." });
  }

  if (otp && otp !== citizen.otp && otp !== "123456") {
    return res.status(401).json({ error: "Invalid OTP verification code. Demo code is '123456'." });
  }

  const token = `CITIZEN-TOKEN-${citizen.id}-${Date.now()}`;

  res.json({
    token,
    citizen: {
      id: citizen.id,
      name: citizen.name,
      mobile: citizen.mobile,
      ackNumber: citizen.ackNumber,
      email: citizen.email
    }
  });
});

// Citizen Records (returns ONLY citizen's linked cases, plain language, NO technical jargon)
app.get('/api/citizen/my-records', (req, res) => {
  const citizenId = req.headers['x-citizen-id'] || req.query.citizenId || "CIT-001";
  const records = store.getCitizenRecords(citizenId);
  res.json({
    citizenId,
    totalRecords: records.length,
    records
  });
});



/* =========================================================
   2. DOCUMENTS & FIR REGISTRATION (LAYERS 1, 2, 3)
   ========================================================= */

// List all documents with summary metrics
app.get('/api/documents', (req, res) => {
  const docs = store.getDocuments();
  const { status, crimeCategory, search } = req.query;

  let filtered = docs;

  if (status && status !== 'ALL') {
    filtered = filtered.filter(d => d.status === status);
  }

  if (crimeCategory && crimeCategory !== 'ALL') {
    filtered = filtered.filter(d => d.crimeCategory === crimeCategory);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.id.toLowerCase().includes(q) ||
      d.firNo.toLowerCase().includes(q) ||
      d.caseTitle.toLowerCase().includes(q) ||
      d.policeStation.toLowerCase().includes(q) ||
      d.actsAndSections.toLowerCase().includes(q) ||
      d.complainant.toLowerCase().includes(q) ||
      d.accused.toLowerCase().includes(q)
    );
  }

  // Calculate metrics
  const metrics = {
    totalDocuments: docs.length,
    lockedCount: docs.filter(d => d.status === 'LOCKED').length,
    pendingQuorumCount: docs.filter(d => d.status === 'PENDING_QUORUM').length,
    rejectedCount: docs.filter(d => d.status === 'REJECTED').length,
    isTampered: store.tampered,
    totalBlocks: store.chain.length
  };

  res.json({
    documents: filtered,
    metrics
  });
});

// Get single document by ID
app.get('/api/documents/:id', (req, res) => {
  const doc = store.getDocument(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: "Document record not found." });
  }
  res.json({ document: doc });
});

// Upload new FIR / Evidence document
app.post('/api/documents', (req, res) => {
  try {
    const { caseTitle, complainant, accused, actsAndSections, incidentSummary, policeStation, district, evidenceFiles, authorId } = req.body;

    if (!caseTitle || !complainant || !incidentSummary) {
      return res.status(400).json({ error: "Case title, complainant, and incident summary are mandatory." });
    }

    const author = DEMO_PERSONAS.find(p => p.id === authorId) || DEMO_PERSONAS[0];
    const newDoc = store.createDocument({
      caseTitle,
      complainant,
      accused,
      actsAndSections,
      incidentSummary,
      policeStation,
      district,
      evidenceFiles
    }, author);

    res.status(201).json({
      message: "FIR successfully locked into Hash-Chain as Version 1.0",
      document: newDoc
    });
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ error: err.message });
  }
});

// Upload Verdict / Judicial Ruling (Section 15 & 13)
app.post('/api/documents/:id/verdict', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      verdictTitle, 
      disposition, 
      verdictSummary, 
      fileName, 
      fileSize, 
      sha256, 
      authorId, 
      ocrText, 
      isAddendum 
    } = req.body;

    if (!disposition || !verdictSummary) {
      return res.status(400).json({ error: "Verdict disposition and judgment summary are mandatory." });
    }

    const author = DEMO_PERSONAS.find(p => p.id === authorId) || DEMO_PERSONAS.find(p => p.portalRole === 'JUDICIAL');
    if (!author || author.portalRole !== 'JUDICIAL') {
      return res.status(403).json({ error: "PERMISSION DENIED: Only authorized Judicial Officers can upload final judgments." });
    }

    const result = store.addVerdict(id, {
      verdictTitle,
      disposition,
      verdictSummary,
      fileName,
      fileSize,
      sha256,
      ocrText,
      isAddendum
    }, author);

    res.json({
      success: true,
      message: "Final Judicial Verdict sealed and locked in WORM repository.",
      document: result.doc,
      verdict: result.verdict
    });
  } catch (err) {
    console.error("Error uploading verdict:", err);
    res.status(err.status || 400).json({ error: err.message });
  }
});

/* =========================================================
   3. EDIT REQUESTS & QUORUM APPROVAL (LAYERS 3, 4)
   ========================================================= */

// Request Edit on a locked document
app.post('/api/documents/:id/request-edit', (req, res) => {
  try {
    const { editSummary, actsAndSections, incidentSummary, newEvidence, requesterId } = req.body;
    const requester = DEMO_PERSONAS.find(p => p.id === requesterId) || DEMO_PERSONAS[0];

    const updatedDoc = store.requestEdit(req.params.id, {
      editSummary,
      actsAndSections,
      incidentSummary,
      newEvidence
    }, requester);

    res.json({
      message: "Edit request registered. Status changed to PENDING_QUORUM.",
      document: updatedDoc
    });
  } catch (err) {
    console.error("Error requesting edit:", err);
    res.status(400).json({ error: err.message });
  }
});

// Cast vote in Quorum session
app.post('/api/documents/:id/quorum-vote', (req, res) => {
  try {
    const { version, approverId, vote, comment } = req.body;

    if (!approverId || !vote) {
      return res.status(400).json({ error: "Approver ID and vote ('APPROVE'|'REJECT') are required." });
    }

    const approver = DEMO_PERSONAS.find(p => p.id === approverId);
    if (!approver) {
      return res.status(404).json({ error: "Approver persona not found." });
    }

    const result = store.voteQuorum(req.params.id, version || "1.1", approver, vote, comment);

    res.json({
      message: result.voteResult.isApproved
        ? "Quorum threshold achieved! Version has been cryptographically committed into Hash-Chain."
        : result.voteResult.isRejected
        ? "Quorum consensus rejected. Draft update marked as REJECTED."
        : `Vote recorded (${result.voteResult.session.approvalCount} of ${result.voteResult.session.threshold} required approvals).`,
      document: result.doc,
      quorumSession: result.voteResult.session
    });
  } catch (err) {
    console.error("Quorum vote error:", err);
    const statusCode = err.status || (err.code === "SELF_APPROVAL_FORBIDDEN" ? 403 : 400);
    res.status(statusCode).json({ error: err.message, code: err.code });
  }
});

/* =========================================================
   4. VERSION CHAIN & LINEAGE (PAGE 6)
   ========================================================= */

app.get('/api/documents/:id/chain', (req, res) => {
  const chain = store.getChain(req.params.id);
  const doc = store.getDocument(req.params.id);

  res.json({
    docId: req.params.id,
    currentVersion: doc ? doc.currentVersion : "1.0",
    status: doc ? doc.status : "UNKNOWN",
    blocks: chain
  });
});

/* =========================================================
   5. WORM AUDIT LOGS (LAYER 6 - STRICT APPEND-ONLY)
   ========================================================= */

// Notice: NO PUT / PATCH / DELETE endpoint exists!
app.get('/api/audit-logs', (req, res) => {
  const { layer, search, docId } = req.query;
  const logs = wormAudit.getAll({ layer, search, docId });

  res.json({
    total: logs.length,
    layerFiltered: layer || "ALL",
    logs
  });
});

/* =========================================================
   6. TAMPER DETECTION & SIMULATION (LAYER 6)
   ========================================================= */

// Verify cryptographic integrity of entire chain & WORM
app.post('/api/tamper/verify', (req, res) => {
  const result = store.verifyIntegrity();
  res.json(result);
});

// Simulate unauthorized DB tampering for live demonstration
app.post('/api/tamper/simulate', (req, res) => {
  try {
    const { docId, tamperedText } = req.body;
    const targetDocId = docId || "FIR-2024-ND-0842";
    const result = store.simulateTamper(targetDocId, tamperedText);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Restore ledger integrity to pristine seed state
app.post('/api/tamper/restore', (req, res) => {
  const result = store.restoreIntegrity();
  res.json(result);
});

/* =========================================================
   START SERVER
   ========================================================= */

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SecureChain DMS Server active on port http://localhost:${PORT}`);
    console.log(`🔒 6-Layer Security Architecture: SHA-256 Hash Chain Ready`);
    console.log(`🛡️  WORM Audit Log Initialized: Append-Only Protection`);
    console.log(`⚖️  M-of-N Quorum Consensus Engine Online`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
