const { sha256, createGenesisBlock, createBlock, verifyChain, calculateBlockHash } = require('../ledger/hashChain');
const { encryptAtRest, decryptOnTheFly } = require('../ledger/encryption');
const wormAudit = require('../ledger/wormAudit');
const quorumEngine = require('../ledger/quorumEngine');
const { DEMO_PERSONAS, SEED_CITIZENS, SEED_CASES } = require('./seedData');

class DataStore {
  constructor() {
    this.documents = new Map();
    this.citizens = new Map();
    this.caseParties = []; // { citizenId, documentId, partyRole }
    this.chain = [];
    this.tampered = false;
    this.tamperDetails = null;
    this.init();
  }

  init() {
    // 0. Seed Citizens & Case Parties
    SEED_CITIZENS.forEach(cit => {
      this.citizens.set(cit.id, cit);
      cit.linkedCases.forEach(docId => {
        this.caseParties.push({
          citizenId: cit.id,
          documentId: docId,
          partyRole: "Complainant"
        });
      });
    });

    // 1. Genesis Block
    const genesis = createGenesisBlock();

    this.chain = [genesis];

    // Log genesis to WORM
    wormAudit.append({
      layerNumber: 5,
      layerName: "Layer 5 - Immutable Anchor",
      employeeId: "ROOT_ANCHOR",
      role: "System Root Authority",
      action: "GENESIS_ANCHOR_INITIALIZED",
      docId: "ROOT",
      version: "1.0",
      beforeHash: "0000000000000000000000000000000000000000000000000000000000000000",
      afterHash: genesis.hash,
      details: { message: "Root hash-chain anchor initialized for Government of India DMS" }
    });

    // 2. Ingest Seed Cases
    SEED_CASES.forEach((caseItem) => {
      // Deep clone so seed remains pristine for reset
      const doc = JSON.parse(JSON.stringify(caseItem));

      // Create v1.0 Block
      const prevBlock = this.chain[this.chain.length - 1];
      const block = createBlock({
        previousBlock: prevBlock,
        docId: doc.id,
        version: "1.0",
        payload: {
          id: doc.id,
          firNo: doc.firNo,
          policeStation: doc.policeStation,
          actsAndSections: doc.actsAndSections,
          caseTitle: doc.caseTitle,
          complainant: doc.complainant,
          accused: doc.accused,
          investigatingOfficer: doc.investigatingOfficer,
          incidentSummary: doc.incidentSummary,
          evidenceFiles: doc.evidenceFiles,
          version: "1.0"
        },
        actorId: wormAudit.getPseudonym(doc.requesterId, "Investigating Officer"),
        actorRole: "Investigating Officer",
        action: "DOCUMENT_REGISTRATION_AND_LOCK"
      });

      this.chain.push(block);

      // Attach cryptographic metadata to the document
      doc.blockIndex = block.index;
      doc.sha256 = block.hash;
      doc.payloadHash = block.payloadHash;
      doc.previousHash = block.previousHash;
      doc.lockedAt = block.timestamp;
      
      // Master Spec Section 20.1: AES-256 Encryption at Rest
      doc.encryption = encryptAtRest({
        id: doc.id,
        firNo: doc.firNo,
        incidentSummary: doc.incidentSummary,
        actsAndSections: doc.actsAndSections
      });

      this.documents.set(doc.id, doc);

      // Append WORM Audit Logs for this ingestion
      wormAudit.append({
        layerNumber: 1,
        layerName: "Layer 1 - Ingestion & Inflow Gate",
        employeeId: doc.requesterId,
        role: "Investigating Officer",
        action: "FIR_INGESTION_RECEIVED",
        docId: doc.id,
        version: "1.0",
        beforeHash: null,
        afterHash: block.payloadHash,
        details: { firNo: doc.firNo, ps: doc.policeStation }
      });

      wormAudit.append({
        layerNumber: 2,
        layerName: "Layer 2 - SHA-256 Hash Integrity",
        employeeId: doc.requesterId,
        role: "Investigating Officer",
        action: "CRYPTOGRAPHIC_HASH_GENERATED",
        docId: doc.id,
        version: "1.0",
        beforeHash: block.previousHash,
        afterHash: block.hash,
        details: { blockIndex: block.index, payloadHash: block.payloadHash }
      });

      wormAudit.append({
        layerNumber: 3,
        layerName: "Layer 3 - Version Lineage Lock",
        employeeId: doc.requesterId,
        role: "Investigating Officer",
        action: "VERSION_1_0_LOCKED",
        docId: doc.id,
        version: "1.0",
        beforeHash: null,
        afterHash: block.hash,
        details: { state: "LOCKED_IMMUTABLE" }
      });

      // Special setup for FIR-2024-MH-1920 which starts in PENDING_QUORUM state with v1.1
      if (doc.id === "FIR-2024-MH-1920" && doc.status === "PENDING_QUORUM") {
        const approvers = DEMO_PERSONAS.filter(p => p.canApprove);
        const session = quorumEngine.createSession({
          docId: doc.id,
          version: "1.1",
          requesterId: doc.requesterId,
          requesterName: "Inspector Rajesh Sharma",
          requesterRole: "Investigating Officer",
          editSummary: "Added Section 121A (Waging War against the State), Frankfurt C2 IPs and malware decrypt key.",
          threshold: 2,
          totalEligible: 3,
          eligibleApprovers: approvers
        });

        // Add 1 vote already cast by SP Anita Roy for demo realism!
        const voteResult = quorumEngine.castVote({
          docId: doc.id,
          version: "1.1",
          approverId: "POL-IPS-1094",
          approverName: "SP Anita Roy, IPS",
          vote: "APPROVE",
          comment: "Forensic mirror image verified with CERT-In report. Concur with addition of Section 121A."
        });

        doc.quorumSession = voteResult.session;

        // Log quorum session to WORM
        wormAudit.append({
          layerNumber: 4,
          layerName: "Layer 4 - M-of-N Quorum Consensus",
          employeeId: doc.requesterId,
          role: "Investigating Officer",
          action: "EDIT_REQUEST_INITIALIZED",
          docId: doc.id,
          version: "1.1",
          beforeHash: doc.sha256,
          afterHash: sha256(doc.versions[1]),
          details: { threshold: "2 of 3", reason: "Supplementary Forensic Exhibits" }
        });

        wormAudit.append({
          layerNumber: 4,
          layerName: "Layer 4 - M-of-N Quorum Consensus",
          employeeId: "POL-IPS-1094",
          role: "Supervisory Reviewer",
          action: "QUORUM_VOTE_CAST_APPROVE",
          docId: doc.id,
          version: "1.1",
          beforeHash: doc.sha256,
          afterHash: sha256("VOTE_SP_ANITA_APPROVE"),
          details: { vote: "APPROVE", currentApprovalCount: 1, required: 2 }
        });
      }
    });
  }

  getDocuments() {
    return Array.from(this.documents.values());
  }

  getDocument(id) {
    const doc = this.documents.get(id);
    if (!doc) return null;

    // Attach current quorum session if active
    if (doc.status === "PENDING_QUORUM" && doc.draftVersion) {
      doc.quorumSession = quorumEngine.getSession(doc.id, doc.draftVersion);
    }
    return doc;
  }

  getCitizenRecords(citizenId) {
    const partyLinks = this.caseParties.filter(cp => cp.citizenId === citizenId);
    const results = [];

    partyLinks.forEach(link => {
      const doc = this.documents.get(link.documentId);
      if (doc) {
        let plainStatus = "Under Investigation";
        if (doc.verdict) {
          plainStatus = `Verdict Delivered — ${new Date(doc.verdict.deliveredDate).toLocaleDateString('en-GB')}`;
        } else if (doc.status === "PENDING_QUORUM") {
          plainStatus = "Update Pending Review";
        } else if (doc.status === "LOCKED") {
          plainStatus = "Under Investigation";
        } else if (doc.status === "REJECTED") {
          plainStatus = "Case Closed";
        }

        results.push({
          id: doc.id,
          firNo: doc.firNo,
          year: doc.year || "2024",
          policeStation: doc.policeStation,
          district: doc.district,
          state: doc.state,
          caseTitle: doc.caseTitle,
          crimeCategory: doc.crimeCategory,
          dateReported: doc.dateReported,
          status: plainStatus,
          statusCode: doc.status,
          incidentSummary: doc.incidentSummary,
          partyRole: link.partyRole,
          verdict: doc.verdict || null
        });
      }
    });

    return results;
  }

  /**
   * Judicial Verdict Upload (Authoritative Judgment)
   * Narrowly scoped exception for final rulings:
   * - Does NOT require quorum peer review
   * - Cannot overwrite an existing verdict (no-overwrite rule; addendum only)
   * - Hashed with SHA-256 and locked immediately into WORM ledger
   */
  addVerdict(docId, verdictData, author) {
    if (author.portalRole !== "JUDICIAL") {
      const err = new Error("PERMISSION DENIED: Only authorized Judicial Officers can pronounce and upload final verdicts.");
      err.status = 403;
      throw err;
    }

    const doc = this.documents.get(docId);
    if (!doc) {
      const err = new Error("Case record not found for verdict linkage.");
      err.status = 404;
      throw err;
    }

    // No-overwrite rule: once uploaded, a verdict cannot be overwritten
    if (doc.verdict && !verdictData.isAddendum) {
      const err = new Error("IMMUTABLE RULING RULE: A final judgment has already been locked for this case. Overwriting is strictly prohibited. You may only attach a dated supplementary addendum.");
      err.status = 409;
      throw err;
    }

    const timestamp = new Date().toISOString();
    const verdictId = `VERDICT-${doc.firNo.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    const verdictHash = verdictData.sha256 || sha256((verdictData.verdictSummary || "") + timestamp + doc.id);

    const verdict = {
      id: verdictId,
      documentType: "Judgment",
      verdictTitle: verdictData.verdictTitle || `Final Judicial Judgment in ${doc.firNo}`,
      judgeName: author.name || "Judicial Magistrate",
      judgeId: author.id,
      court: author.court || doc.court || "Patiala House Courts, New Delhi",
      disposition: verdictData.disposition || "CONVICTED",
      verdictSummary: verdictData.verdictSummary || "Judgment pronounced after judicial trial.",
      deliveredDate: timestamp,
      fileName: verdictData.fileName || "Final_Judgment_Order.pdf",
      fileSize: verdictData.fileSize || "2.1 MB",
      sha256: verdictHash,
      status: "LOCKED_FINAL",
      lockedAt: timestamp,
      ocrConfirmedText: verdictData.ocrText || verdictData.verdictSummary || null,
      isAddendum: !!verdictData.isAddendum
    };

    if (verdictData.isAddendum && doc.verdict) {
      if (!doc.verdictAddendums) doc.verdictAddendums = [];
      doc.verdictAddendums.push(verdict);
    } else {
      doc.verdict = verdict;
      doc.statusPlain = `Verdict Delivered — ${new Date(timestamp).toLocaleDateString('en-GB')}`;
      doc.verdictDeliveredAt = timestamp;
    }

    if (!doc.evidenceFiles) doc.evidenceFiles = [];
    doc.evidenceFiles.push({
      name: verdict.fileName,
      size: verdict.fileSize,
      sha256: verdict.sha256,
      type: "Judgment",
      uploadedBy: author.name
    });

    // Create block in the hash-chain immediately (no quorum required for final judicial order)
    const prevBlock = this.chain[this.chain.length - 1];
    const block = createBlock({
      previousBlock: prevBlock,
      docId: doc.id,
      version: doc.currentVersion,
      payload: {
        docId: doc.id,
        firNo: doc.firNo,
        documentType: "Judgment",
        judgeName: verdict.judgeName,
        court: verdict.court,
        disposition: verdict.disposition,
        verdictHash: verdict.sha256,
        deliveredDate: verdict.deliveredDate
      },
      actorId: wormAudit.getPseudonym(author.id, "Judicial Magistrate"),
      actorRole: "Judicial Magistrate",
      action: "JUDICIAL_VERDICT_PRONOUNCED_AND_LOCKED"
    });

    this.chain.push(block);

    // Append to WORM Audit Log
    wormAudit.append({
      layerNumber: 5,
      layerName: "Layer 5 - Judicial Pronouncement & Final Seal",
      employeeId: author.id,
      role: author.role || "Judicial Magistrate",
      action: "JUDICIAL_VERDICT_LOCKED",
      docId: doc.id,
      version: doc.currentVersion,
      beforeHash: prevBlock.hash,
      afterHash: block.hash,
      details: {
        disposition: verdict.disposition,
        court: verdict.court,
        verdictHash: verdict.sha256,
        firNo: doc.firNo
      }
    });

    return { doc, verdict };
  }

  createDocument(data, author) {
    // Permission check: Judicial officers cannot upload documents
    if (author.portalRole === "JUDICIAL") {
      const err = new Error("PERMISSION DENIED: Judicial officers have review-only authority and cannot create or upload investigation records.");
      err.status = 403;
      throw err;
    }

    const id = `FIR-${new Date().getFullYear()}-${data.stateCode || "ND"}-${Math.floor(1000 + Math.random() * 9000)}`;
    const firNo = `${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`;

    const newDoc = {
      id,
      firNo,
      year: `${new Date().getFullYear()}`,
      state: data.state || "Delhi",
      district: data.district || "New Delhi District",
      policeStation: data.policeStation || "Special Investigation Division PS, Mandir Marg",
      actsAndSections: data.actsAndSections || "Section 420/468/471 IPC",
      caseTitle: data.caseTitle,
      crimeCategory: data.crimeCategory || "Financial Embezzlement & Banking Fraud",
      dateReported: new Date().toISOString(),
      occurrenceDate: data.occurrenceDate || new Date().toISOString(),
      placeOfOccurrence: data.placeOfOccurrence || "Within station jurisdiction",
      typeOfInformation: data.typeOfInformation || "Written Complaint",
      complainant: data.complainant,
      accused: data.accused || "Unknown Suspects",
      investigatingOfficer: author.name,
      requesterId: author.id,
      currentVersion: "1.0",
      status: "LOCKED",
      statusPlain: "Under Investigation",
      incidentSummary: data.incidentSummary,
      propertiesInvolved: data.propertiesInvolved || "Seized electronic exhibits & case documents",
      stolenValue: data.stolenValue || "Under technical assessment",
      actionTaken: "Case registered under CrPC 154 / BNSS 173 and investigation initiated",
      inquestNo: "N/A",
      delayReasons: data.delayReasons || "None",
      evidenceFiles: data.evidenceFiles || [
        { name: "Complaint_Filing_Form.pdf", size: "1.4 MB", sha256: sha256(data.caseTitle + id) }
      ],
      versions: [
        {
          version: "1.0",
          createdAt: new Date().toISOString(),
          status: "LOCKED",
          title: "Initial FIR Registration & Evidence Ingestion",
          authorId: author.id,
          authorPseudonym: wormAudit.getPseudonym(author.id, author.role),
          summaryDiff: "Genesis formal registration of FIR under Section 154 CrPC."
        }
      ]
    };

    // Chain block
    const prevBlock = this.chain[this.chain.length - 1];
    const block = createBlock({
      previousBlock: prevBlock,
      docId: id,
      version: "1.0",
      payload: {
        id,
        firNo,
        policeStation: newDoc.policeStation,
        actsAndSections: newDoc.actsAndSections,
        caseTitle: newDoc.caseTitle,
        complainant: newDoc.complainant,
        accused: newDoc.accused,
        incidentSummary: newDoc.incidentSummary,
        version: "1.0"
      },
      actorId: wormAudit.getPseudonym(author.id, author.role),
      actorRole: author.role,
      action: "DOCUMENT_REGISTRATION_AND_LOCK"
    });

    this.chain.push(block);
    newDoc.blockIndex = block.index;
    newDoc.sha256 = block.hash;
    newDoc.payloadHash = block.payloadHash;
    newDoc.previousHash = block.previousHash;
    newDoc.lockedAt = block.timestamp;

    // Master Spec Section 20.1: AES-256 Encryption at Rest
    newDoc.encryption = encryptAtRest({
      id: newDoc.id,
      firNo: newDoc.firNo,
      incidentSummary: newDoc.incidentSummary,
      actsAndSections: newDoc.actsAndSections
    });

    this.documents.set(id, newDoc);

    // WORM Log entries
    wormAudit.append({
      layerNumber: 1,
      layerName: "Layer 1 - Ingestion & Inflow Gate",
      employeeId: author.id,
      role: author.role,
      action: "FIR_INGESTION_RECEIVED",
      docId: id,
      version: "1.0",
      beforeHash: null,
      afterHash: block.payloadHash,
      details: { firNo, ps: newDoc.policeStation }
    });

    wormAudit.append({
      layerNumber: 2,
      layerName: "Layer 2 - SHA-256 Hash Integrity",
      employeeId: author.id,
      role: author.role,
      action: "CRYPTOGRAPHIC_HASH_GENERATED",
      docId: id,
      version: "1.0",
      beforeHash: block.previousHash,
      afterHash: block.hash,
      details: { blockIndex: block.index, payloadHash: block.payloadHash }
    });

    wormAudit.append({
      layerNumber: 3,
      layerName: "Layer 3 - Version Lineage Lock",
      employeeId: author.id,
      role: author.role,
      action: "VERSION_1_0_LOCKED",
      docId: id,
      version: "1.0",
      beforeHash: null,
      afterHash: block.hash,
      details: { state: "LOCKED_IMMUTABLE" }
    });

    return newDoc;
  }

  requestEdit(docId, editData, requester) {
    if (requester.portalRole === "JUDICIAL") {
      const err = new Error("PERMISSION DENIED: Judicial officers have review-only authority and cannot submit edit requests.");
      err.status = 403;
      throw err;
    }

    const doc = this.documents.get(docId);
    if (!doc) throw new Error("Document not found");

    if (doc.status === "PENDING_QUORUM") {
      throw new Error("An edit request is already pending quorum approval for this document.");
    }

    const currentMajor = parseFloat(doc.currentVersion);
    const draftVersion = (currentMajor + 0.1).toFixed(1);

    // Save draft state
    doc.status = "PENDING_QUORUM";
    doc.draftVersion = draftVersion;
    doc.draftData = {
      ...editData,
      requestedAt: new Date().toISOString(),
      requesterId: requester.id,
      requesterName: requester.name
    };

    doc.versions.push({
      version: draftVersion,
      createdAt: new Date().toISOString(),
      status: "PENDING_QUORUM",
      title: editData.title || `Supplementary Report (Draft ${draftVersion})`,
      authorId: requester.id,
      authorPseudonym: wormAudit.getPseudonym(requester.id, requester.role),
      summaryDiff: editData.editSummary || "Supplementary findings submitted for multi-party quorum review."
    });

    // Create Quorum Session with severity-based pool routing (Section 20.2)
    const approvers = DEMO_PERSONAS.filter(p => p.canApprove);
    const session = quorumEngine.createSession({
      docId,
      version: draftVersion,
      requesterId: requester.id,
      requesterName: requester.name,
      requesterRole: requester.role,
      editSummary: editData.editSummary || "Request for supplementary FIR amendments",
      severityText: `${doc.actsAndSections || ''} ${doc.caseTitle || ''} ${doc.incidentSummary || ''} ${editData.editSummary || ''}`,
      eligibleApprovers: approvers
    });

    doc.quorumSession = session;
    doc.sensitivityTier = session.pool === 'STATE_LEVEL' ? 'HIGH' : (session.threshold === 1 ? 'LOW' : 'MEDIUM');
    doc.jurisdictionalPool = session.poolLabel;

    // Log to WORM
    wormAudit.append({
      layerNumber: 3,
      layerName: "Layer 3 - Version Lineage Lock",
      employeeId: requester.id,
      role: requester.role,
      action: "DRAFT_VERSION_BRANCHED",
      docId,
      version: draftVersion,
      beforeHash: doc.sha256,
      afterHash: sha256(editData),
      details: { draftVersion, requester: requester.name }
    });

    wormAudit.append({
      layerNumber: 4,
      layerName: "Layer 4 - M-of-N Quorum Consensus",
      employeeId: requester.id,
      role: requester.role,
      action: "QUORUM_APPROVAL_REQUESTED",
      docId,
      version: draftVersion,
      beforeHash: doc.sha256,
      afterHash: sha256(session.sessionKey),
      details: { threshold: "2 of 3 approvals required" }
    });

    return doc;
  }

  voteQuorum(docId, version, approver, vote, comment) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error("Document not found");

    const voteResult = quorumEngine.castVote({
      docId,
      version,
      approverId: approver.id,
      approverName: approver.name,
      vote,
      comment
    });

    // WORM Log entry for vote
    wormAudit.append({
      layerNumber: 4,
      layerName: "Layer 4 - M-of-N Quorum Consensus",
      employeeId: approver.id,
      role: approver.role,
      action: vote === "APPROVE" ? "QUORUM_VOTE_CAST_APPROVE" : "QUORUM_VOTE_CAST_REJECT",
      docId,
      version,
      beforeHash: doc.sha256,
      afterHash: sha256({ approver: approver.id, vote, timestamp: new Date().toISOString() }),
      details: {
        approvalCount: voteResult.session.approvalCount,
        threshold: voteResult.session.threshold,
        comment
      }
    });

    // If threshold reached and approved: Auto-commit new version into hash-chain!
    if (voteResult.isApproved) {
      const prevBlock = this.chain[this.chain.length - 1];

      // Merge updated fields from draft
      if (doc.draftData) {
        if (doc.draftData.actsAndSections) doc.actsAndSections = doc.draftData.actsAndSections;
        if (doc.draftData.incidentSummary) doc.incidentSummary = doc.draftData.incidentSummary;
        if (doc.draftData.newEvidence) {
          doc.evidenceFiles.push(...doc.draftData.newEvidence);
        }
      }

      // Create new cryptographic block in chain
      const newBlock = createBlock({
        previousBlock: prevBlock,
        docId,
        version,
        payload: {
          id: doc.id,
          firNo: doc.firNo,
          policeStation: doc.policeStation,
          actsAndSections: doc.actsAndSections,
          caseTitle: doc.caseTitle,
          incidentSummary: doc.incidentSummary,
          version,
          status: "APPROVED_AND_LOCKED"
        },
        actorId: wormAudit.getPseudonym(approver.id, approver.role),
        actorRole: "Quorum Consensus Authority",
        action: "QUORUM_CONSENSUS_VERSION_COMMIT"
      });

      this.chain.push(newBlock);

      // Update doc state
      doc.status = "LOCKED";
      doc.currentVersion = version;
      doc.previousVersion = "1.0";
      doc.sha256 = newBlock.hash;
      doc.payloadHash = newBlock.payloadHash;
      doc.previousHash = newBlock.previousHash;
      doc.blockIndex = newBlock.index;
      doc.lockedAt = newBlock.timestamp;
      delete doc.draftVersion;
      delete doc.draftData;

      // Update version status in version list
      const vObj = doc.versions.find(v => v.version === version);
      if (vObj) {
        vObj.status = "APPROVED";
      }

      // Log to WORM
      wormAudit.append({
        layerNumber: 4,
        layerName: "Layer 4 - M-of-N Quorum Consensus",
        employeeId: "QUORUM_ENGINE",
        role: "Consensus Engine",
        action: "QUORUM_CONSENSUS_MET_VERSION_COMMITTED",
        docId,
        version,
        beforeHash: prevBlock.hash,
        afterHash: newBlock.hash,
        details: {
          approvals: voteResult.session.approvalCount,
          threshold: voteResult.session.threshold,
          newBlockIndex: newBlock.index
        }
      });

      wormAudit.append({
        layerNumber: 5,
        layerName: "Layer 5 - Immutable Anchor",
        employeeId: "QUORUM_ENGINE",
        role: "Consensus Engine",
        action: "NEW_VERSION_IMMUTABLY_ANCHORED",
        docId,
        version,
        beforeHash: prevBlock.hash,
        afterHash: newBlock.hash,
        details: { blockIndex: newBlock.index }
      });
    } else if (voteResult.isRejected) {
      doc.status = "REJECTED";
      const vObj = doc.versions.find(v => v.version === version);
      if (vObj) {
        vObj.status = "REJECTED";
      }

      wormAudit.append({
        layerNumber: 4,
        layerName: "Layer 4 - M-of-N Quorum Consensus",
        employeeId: "QUORUM_ENGINE",
        role: "Consensus Engine",
        action: "QUORUM_REJECTED",
        docId,
        version,
        beforeHash: doc.sha256,
        afterHash: sha256("QUORUM_REJECTED"),
        details: { rejections: voteResult.session.rejectionCount }
      });
    }

    doc.quorumSession = voteResult.session;
    return { doc, voteResult };
  }

  getChain(docId) {
    if (!docId) return this.chain;
    return this.chain.filter(b => b.docId === docId || b.docId === "GENESIS_ROOT");
  }

  simulateTamper(docId, tamperedText) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error("Document not found");

    // Find block in chain
    const blockIndex = this.chain.findIndex(b => b.docId === docId);
    if (blockIndex === -1) throw new Error("Block not found in chain");

    const block = this.chain[blockIndex];
    const originalText = block.payload.incidentSummary;
    const originalHash = block.hash;

    // Mutate block payload without updating cryptographic hashes — simulating unauthorized SQL injection or direct DB tampering
    block.payload.incidentSummary = tamperedText || "MALICIOUS TAMPER: Record expunged. Accused cleared of all charges under backchannel directive.";
    // doc in memory also altered
    doc.incidentSummary = block.payload.incidentSummary;

    this.tampered = true;
    this.tamperDetails = {
      docId,
      blockIndex,
      originalHash,
      tamperedAt: new Date().toISOString(),
      originalText: originalText.substring(0, 80) + "...",
      modifiedText: block.payload.incidentSummary
    };

    // WORM log logs that an external anomaly occurred
    wormAudit.append({
      layerNumber: 6,
      layerName: "Layer 6 - Cryptographic Audit Guard",
      employeeId: "SYSTEM_MONITOR",
      role: "Tamper Sentinel",
      action: "ANOMALOUS_MUTATION_FLAGGED",
      docId,
      version: doc.currentVersion,
      beforeHash: originalHash,
      afterHash: "INVALID_MUTATION_SUSPECTED",
      details: { blockIndex, note: "Unauthorized modification injected for demo testing" }
    });

    return {
      success: true,
      message: `Tamper simulation active on ${docId} (Block #${blockIndex}). Run 'Verify Integrity' to see cryptographic detection in action.`,
      tamperDetails: this.tamperDetails
    };
  }

  restoreIntegrity() {
    // Reset data back to clean seed
    this.documents.clear();
    this.chain = [];
    this.tampered = false;
    this.tamperDetails = null;
    this.init();

    wormAudit.append({
      layerNumber: 6,
      layerName: "Layer 6 - Cryptographic Audit Guard",
      employeeId: "AUD-MHA-007",
      role: "Chief Forensic Auditor",
      action: "LEDGER_INTEGRITY_RESTORED",
      docId: "ALL_DOCUMENTS",
      version: "ALL",
      beforeHash: null,
      afterHash: this.chain[this.chain.length - 1].hash,
      details: { status: "RESTORED_PRISTINE" }
    });

    return { success: true, message: "Ledger state restored to pristine validated state." };
  }

  verifyIntegrity() {
    const chainVerification = verifyChain(this.chain);
    const wormVerification = wormAudit.verifyLogIntegrity();

    const timestamp = new Date().toISOString();

    if (!chainVerification.valid) {
      wormAudit.append({
        layerNumber: 6,
        layerName: "Layer 6 - Cryptographic Audit Guard",
        employeeId: "SYSTEM_SCANNER",
        role: "Ledger Sentinel",
        action: "TAMPER_DETECTED_INTEGRITY_VIOLATION",
        docId: chainVerification.docId || "UNKNOWN",
        version: "UNKNOWN",
        beforeHash: chainVerification.found || null,
        afterHash: chainVerification.expected || null,
        details: { reason: chainVerification.reason, blockIndex: chainVerification.corruptedIndex }
      });

      return {
        valid: false,
        status: "INTEGRITY_VIOLATION",
        timestamp,
        error: chainVerification.reason,
        corruptedIndex: chainVerification.corruptedIndex,
        docId: chainVerification.docId,
        expectedHash: chainVerification.expected,
        foundHash: chainVerification.found,
        tamperDetails: this.tamperDetails
      };
    }

    // Passed verification
    wormAudit.append({
      layerNumber: 6,
      layerName: "Layer 6 - Cryptographic Audit Guard",
      employeeId: "SYSTEM_SCANNER",
      role: "Ledger Sentinel",
      action: "INTEGRITY_VERIFICATION_PASS",
      docId: "GLOBAL_CHAIN",
      version: "ALL",
      beforeHash: null,
      afterHash: this.chain[this.chain.length - 1].hash,
      details: { totalBlocks: this.chain.length, wormEntries: wormVerification.totalEntries }
    });

    return {
      valid: true,
      status: "VERIFIED_GENUINE",
      timestamp,
      totalBlocksVerified: this.chain.length,
      wormAuditEntriesVerified: wormVerification.totalEntries,
      headHash: this.chain[this.chain.length - 1].hash,
      rootGenesisHash: this.chain[0].hash
    };
  }
}

module.exports = new DataStore();
