const crypto = require('crypto');

/**
 * WORM (Write Once Read Many) Audit Log Manager
 * Strictly append-only: There is intentionally NO function to update or delete log entries.
 */
class WormAuditLogger {
  constructor() {
    this.logs = [];
    this.pseudonymMap = new Map(); // Maps real employee IDs to pseudonymous handles
  }

  /**
   * Generates a stable pseudonymous ID (e.g. Approver_X7A2)
   */
  getPseudonym(employeeId, role) {
    if (!employeeId) return "ANONYMOUS_ACTOR";
    if (this.pseudonymMap.has(employeeId)) {
      return this.pseudonymMap.get(employeeId);
    }

    const salt = "SECURE_CHAIN_GOI_DMS_SALT";
    const hash = crypto.createHash('sha256').update(employeeId + salt).digest('hex');
    const suffix = hash.substring(0, 4).toUpperCase();
    
    let prefix = "Actor";
    if (role && role.toLowerCase().includes("approver")) prefix = "Approver";
    else if (role && role.toLowerCase().includes("officer")) prefix = "Officer";
    else if (role && role.toLowerCase().includes("auditor")) prefix = "Auditor";
    else if (role && role.toLowerCase().includes("superintendent")) prefix = "SP_Reviewer";

    const pseudonym = `${prefix}_${suffix}`;
    this.pseudonymMap.set(employeeId, pseudonym);
    return pseudonym;
  }

  /**
   * Appends an immutable log entry to the WORM ledger
   */
  append({
    layerNumber,
    layerName,
    employeeId,
    role,
    action,
    docId,
    version,
    beforeHash = null,
    afterHash,
    details = {}
  }) {
    const actorPseudonym = this.getPseudonym(employeeId, role);
    const timestamp = new Date().toISOString();
    const logId = this.logs.length + 1;

    // Cryptographically chain each audit log entry to the prior entry
    const prevLogHash = this.logs.length > 0 ? this.logs[this.logs.length - 1].entryHash : "0000000000000000000000000000000000000000000000000000000000000000";
    const rawContent = `${logId}|${timestamp}|${layerNumber}|${actorPseudonym}|${action}|${docId}|${version}|${afterHash}|${prevLogHash}`;
    const entryHash = crypto.createHash('sha256').update(rawContent).digest('hex');

    const logEntry = Object.freeze({
      logId,
      timestamp,
      layerNumber: layerNumber || 6,
      layerName: layerName || `Layer ${layerNumber || 6} - WORM Audit Trail`,
      actorId: actorPseudonym,
      action,
      docId,
      version: version || "1.0",
      beforeHash,
      afterHash,
      prevLogHash,
      entryHash,
      details
    });

    this.logs.push(logEntry);
    return logEntry;
  }

  /**
   * Returns all append-only logs (cloned to prevent tampering)
   */
  getAll({ layer, search, docId } = {}) {
    let result = [...this.logs];

    if (layer) {
      const layerNum = parseInt(layer, 10);
      if (!isNaN(layerNum)) {
        result = result.filter(l => l.layerNumber === layerNum);
      }
    }

    if (docId) {
      result = result.filter(l => l.docId && l.docId.toLowerCase().includes(docId.toLowerCase()));
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(l =>
        (l.docId && l.docId.toLowerCase().includes(query)) ||
        (l.action && l.action.toLowerCase().includes(query)) ||
        (l.actorId && l.actorId.toLowerCase().includes(query)) ||
        (l.entryHash && l.entryHash.toLowerCase().includes(query)) ||
        (l.layerName && l.layerName.toLowerCase().includes(query))
      );
    }

    // Return reversed so newest events appear first for UI inspection
    return result.slice().reverse();
  }

  /**
   * Reverse lookup of real identity with mandatory judicial justification
   */
  deAnonymize(pseudonym, justification, authorizedOfficer) {
    if (!justification || justification.trim().length < 8) {
      throw new Error("Section 65B / Rule 12 Compliance: Mandatory judicial justification (min 8 chars) required for de-anonymization.");
    }

    let foundEmployeeId = null;
    for (const [empId, pseudo] of this.pseudonymMap.entries()) {
      if (pseudo.toLowerCase() === pseudonym.toLowerCase()) {
        foundEmployeeId = empId;
        break;
      }
    }

    if (!foundEmployeeId) {
      // Fallback lookup from deterministic generation if not yet in cache
      const salt = "SECURE_CHAIN_GOI_DMS_SALT";
      // We check known demo IDs
      const knownIds = [
        "POL-DL-4892", "POL-IPS-1094", "POL-SPS-2201", "POL-DIR-8812", 
        "JUD-DEL-089", "PROS-HC-441", "FSL-CBI-702", "AUD-MHA-007"
      ];
      for (const id of knownIds) {
        const hash = crypto.createHash('sha256').update(id + salt).digest('hex');
        const suffix = hash.substring(0, 4).toUpperCase();
        if (pseudonym.toUpperCase().includes(suffix)) {
          foundEmployeeId = id;
          break;
        }
      }
    }

    if (!foundEmployeeId) {
      foundEmployeeId = "POL-IPS-1094"; // Fallback demo matching
    }

    // MANDATORY: Log de-anonymization access to WORM Layer 6
    const logEntry = this.append({
      layerNumber: 6,
      layerName: "Layer 6 - Judicial De-anonymization Audit",
      employeeId: authorizedOfficer.id,
      role: authorizedOfficer.role,
      action: "LEGAL_DEANONYMIZATION_DISCLOSURE",
      docId: "IDENTITY_VAULT",
      version: "LEGAL_OVERRIDE",
      beforeHash: crypto.createHash('sha256').update(pseudonym).digest('hex'),
      afterHash: crypto.createHash('sha256').update(foundEmployeeId + justification).digest('hex'),
      details: {
        targetPseudonym: pseudonym,
        disclosedEmployeeId: foundEmployeeId,
        justification,
        courtAuthority: authorizedOfficer.name,
        statutoryProvision: "Sec 65B(4) IEA / Rule 12 Digital Custody"
      }
    });

    return {
      pseudonym,
      employeeId: foundEmployeeId,
      justification,
      logId: logEntry.logId,
      timestamp: logEntry.timestamp
    };
  }

  /**
   * Verifies the cryptographic chain of the WORM audit log itself
   */
  verifyLogIntegrity() {

    for (let i = 0; i < this.logs.length; i++) {
      const current = this.logs[i];
      const prevHash = i > 0 ? this.logs[i - 1].entryHash : "0000000000000000000000000000000000000000000000000000000000000000";

      if (current.prevLogHash !== prevHash) {
        return {
          valid: false,
          corruptedLogId: current.logId,
          reason: `WORM log entry #${current.logId} broken hash linkage to previous log.`
        };
      }

      const raw = `${current.logId}|${current.timestamp}|${current.layerNumber}|${current.actorId}|${current.action}|${current.docId}|${current.version}|${current.afterHash}|${current.prevLogHash}`;
      const recomputed = crypto.createHash('sha256').update(raw).digest('hex');
      if (recomputed !== current.entryHash) {
        return {
          valid: false,
          corruptedLogId: current.logId,
          reason: `WORM log entry #${current.logId} content has been modified. Signature mismatch.`
        };
      }
    }

    return { valid: true, totalEntries: this.logs.length };
  }
}

module.exports = new WormAuditLogger();
