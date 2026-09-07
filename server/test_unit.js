const quorumEngine = require('./ledger/quorumEngine');
const store = require('./data/store');
const { encryptAtRest, decryptOnTheFly } = require('./ledger/encryption');
const { DEMO_PERSONAS } = require('./data/seedData');

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

// 5. Test Judicial Verdict Upload & Immediate Lock
const judge = DEMO_PERSONAS.find(p => p.portalRole === "JUDICIAL");
const police = DEMO_PERSONAS.find(p => p.portalRole === "POLICE");

// 5A: Non-judicial role upload must be rejected
try {
  store.addVerdict("FIR-2024-ND-0842", { disposition: "CONVICTED", verdictSummary: "Test by police" }, police);
  console.error("FAIL: Police was allowed to upload a judicial verdict!");
  process.exit(1);
} catch (err) {
  if (err.status === 403) {
    console.log("PASS: Non-judicial role blocked from verdict upload with 403 Forbidden.");
  } else {
    console.error("FAIL: Unexpected error on non-judicial verdict upload:", err);
    process.exit(1);
  }
}

// 5B: Judicial officer uploads authoritative verdict
const verdictRes = store.addVerdict("FIR-2024-ND-0842", {
  verdictTitle: "Final Judgment of Conviction",
  disposition: "CONVICTED",
  verdictSummary: "Accused convicted under Section 420/468 IPC. Sentenced to 3 years rigorous imprisonment.",
  fileName: "Judgment_FIR_0842_2024.pdf"
}, judge);

if (!verdictRes.verdict || verdictRes.verdict.disposition !== "CONVICTED" || verdictRes.doc.verdict.status !== "LOCKED_FINAL") {
  console.error("FAIL: Verdict upload did not seal correctly!");
  process.exit(1);
}
console.log("PASS: Judicial verdict uploaded, hashed, and immediately locked without quorum.");

// 5C: No-overwrite rule check
try {
  store.addVerdict("FIR-2024-ND-0842", { disposition: "ACQUITTED", verdictSummary: "Attempted overwrite" }, judge);
  console.error("FAIL: Overwrite of existing verdict was incorrectly permitted!");
  process.exit(1);
} catch (err) {
  if (err.status === 409) {
    console.log("PASS: No-overwrite rule enforced with 409 Conflict.");
  } else {
    console.error("FAIL: Unexpected error on verdict overwrite attempt:", err);
    process.exit(1);
  }
}

// 5D: Citizen visibility check
const citizenRecordsAfterVerdict = store.getCitizenRecords("CIT-001");
const updatedRecord = citizenRecordsAfterVerdict.find(r => r.id === "FIR-2024-ND-0842");
if (!updatedRecord || !updatedRecord.verdict || !updatedRecord.status.startsWith("Verdict Delivered")) {
  console.error("FAIL: Citizen records did not reflect delivered verdict:", updatedRecord);
  process.exit(1);
}
console.log("PASS: Citizen records reflect plain language verdict status:", updatedRecord.status);

console.log("ALL UNIT TESTS PASSED SUCCESSFULLY!");
process.exit(0);
