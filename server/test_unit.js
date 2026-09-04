const quorumEngine = require('./ledger/quorumEngine');
const store = require('./data/store');
const { encryptAtRest, decryptOnTheFly } = require('./ledger/encryption');

console.log("=== RUNNING DIRECT UNIT TESTS ===");

// 1. Test Encryption at Rest (Section 20.1)
const samplePayload = { case: "FIR-2024-TEST", summary: "Classified legal exhibit" };
const enc = encryptAtRest(samplePayload);
console.log("Encrypted at rest:", enc.algorithm, "status:", enc.status);
if (enc.algorithm !== 'aes-256-gcm' || !enc.encryptedData) {
  console.error("FAIL: AES-256-GCM encryption failed");
  process.exit(1);
}
const dec = decryptOnTheFly(enc, "POLICE");
const parsed = JSON.parse(dec);
if (parsed.case !== "FIR-2024-TEST") {
  console.error("FAIL: Decryption mismatch");
  process.exit(1);
}
console.log("PASS: AES-256-GCM encryption and on-the-fly decryption verified.");

// 2. Test Severity-based Pool Routing (Section 20.2)
const statePoolSession = quorumEngine.createSession({
  docId: "DOC-HIGH-01",
  version: "1.1",
  requesterId: "POL-01",
  requesterName: "Officer 1",
  requesterRole: "IO",
  editSummary: "Added Section 302 IPC (Murder) and UAPA charges",
  severityText: "murder terrorism"
});
console.log("High severity session:", statePoolSession.pool, statePoolSession.threshold, "of", statePoolSession.totalEligible, statePoolSession.poolLabel);
if (statePoolSession.pool !== "STATE_LEVEL" || statePoolSession.threshold !== 3 || statePoolSession.totalEligible !== 5) {
  console.error("FAIL: High severity should route to 3-of-5 State Police Review Pool");
  process.exit(1);
}
console.log("PASS: High-severity routed to State Police Review Pool (3-of-5).");

// 3. Test Rule 4B Self-Approval Hard Block (Section 12 & 17)
try {
  quorumEngine.castVote({
    docId: "DOC-HIGH-01",
    version: "1.1",
    approverId: "POL-01", // SAME AS REQUESTER
    approverName: "Officer 1",
    vote: "APPROVE",
    comment: "Self approval attempt"
  });
  console.error("FAIL: Self-approval was not blocked!");
  process.exit(1);
} catch (err) {
  if (err.status === 403 && err.code === "SELF_APPROVAL_FORBIDDEN") {
    console.log("PASS: Rule 4B self-approval hard-blocked with 403 Forbidden.");
  } else {
    console.error("FAIL: Unexpected error on self-approval:", err);
    process.exit(1);
  }
}

// 4. Test Citizen Records Isolation (Section 6 & 17)
const citizenRecords = store.getCitizenRecords("CIT-001");
console.log("Citizen CIT-001 records count:", citizenRecords.length);
if (citizenRecords.some(r => r.id !== "FIR-2024-ND-0842")) {
  console.error("FAIL: Citizen received records not belonging to them!");
  process.exit(1);
}
console.log("PASS: Citizen records isolation verified.");

console.log("ALL UNIT TESTS PASSED SUCCESSFULLY!");
process.exit(0);
