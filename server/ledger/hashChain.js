const crypto = require('crypto');

/**
 * Computes SHA-256 hash of any string or object
 */
function sha256(data) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes block hash for a cryptographic block in the hash-chain
 */
function calculateBlockHash({ index, timestamp, docId, version, payloadHash, previousHash, actorId }) {
  const rawString = `${index}|${timestamp}|${docId}|${version}|${payloadHash}|${previousHash}|${actorId}`;
  return crypto.createHash('sha256').update(rawString).digest('hex');
}

/**
 * Creates Genesis Block for the SecureChain DMS ledger
 */
function createGenesisBlock() {
  const timestamp = "2024-01-01T00:00:00.000Z";
  const payload = {
    system: "SecureChain DMS — National Digital Evidence Repository",
    genesisMessage: "National Investigation Records Cryptographic Root Anchor",
    authority: "Ministry of Home Affairs, Government of India"
  };
  const payloadHash = sha256(payload);
  const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
  const actorId = "SYSTEM_ROOT_ANCHOR";

  const block = {
    index: 0,
    timestamp,
    docId: "GENESIS_ROOT",
    version: "1.0",
    payload,
    payloadHash,
    previousHash,
    actorId,
    actorRole: "System Anchor",
    action: "GENESIS_INITIALIZATION",
    hash: calculateBlockHash({
      index: 0,
      timestamp,
      docId: "GENESIS_ROOT",
      version: "1.0",
      payloadHash,
      previousHash,
      actorId
    })
  };

  return block;
}

/**
 * Creates a new block linked to the latest block in chain
 */
function createBlock({ previousBlock, docId, version, payload, actorId, actorRole, action }) {
  const index = previousBlock ? previousBlock.index + 1 : 0;
  const timestamp = new Date().toISOString();
  const payloadHash = sha256(payload);
  const previousHash = previousBlock ? previousBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";

  const hash = calculateBlockHash({
    index,
    timestamp,
    docId,
    version,
    payloadHash,
    previousHash,
    actorId
  });

  return {
    index,
    timestamp,
    docId,
    version,
    payload,
    payloadHash,
    previousHash,
    actorId,
    actorRole,
    action: action || "DOCUMENT_LOCK",
    hash
  };
}

/**
 * Validates the entire hash-chain for tamper detection.
 * Returns { valid: boolean, corruptedIndex: number|null, reason: string|null, details: object|null }
 */
function verifyChain(chain) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { valid: false, reason: "Hash-chain is empty or invalid structure" };
  }

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];

    // Check payload hash
    const computedPayloadHash = sha256(current.payload);
    if (computedPayloadHash !== current.payloadHash) {
      return {
        valid: false,
        corruptedIndex: current.index,
        docId: current.docId,
        reason: `Payload integrity mismatch at Block #${current.index}. Stored payloadHash does not match payload content.`,
        expected: computedPayloadHash,
        found: current.payloadHash
      };
    }

    // Check block hash calculation
    const computedBlockHash = calculateBlockHash(current);
    if (computedBlockHash !== current.hash) {
      return {
        valid: false,
        corruptedIndex: current.index,
        docId: current.docId,
        reason: `Cryptographic block hash mismatch at Block #${current.index}. Block signature has been tampered with.`,
        expected: computedBlockHash,
        found: current.hash
      };
    }

    // Check link to previous block
    if (i > 0) {
      const prev = chain[i - 1];
      if (current.previousHash !== prev.hash) {
        return {
          valid: false,
          corruptedIndex: current.index,
          docId: current.docId,
          reason: `Broken chain link between Block #${prev.index} and Block #${current.index}. Previous hash pointer mismatch.`,
          expected: prev.hash,
          found: current.previousHash
        };
      }
    }
  }

  return { valid: true, count: chain.length };
}

module.exports = {
  sha256,
  calculateBlockHash,
  createGenesisBlock,
  createBlock,
  verifyChain
};
