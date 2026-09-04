/**
 * AES-256-GCM Encryption at Rest Engine for SecureChain DMS
 * Compliant with Master Spec Section 20.1:
 * - Every uploaded PDF and evidence file is encrypted using AES-256 before being written to storage.
 * - Integrity hash (SHA-256) is computed on human-confirmed text (Section 13) independently of encryption.
 * - Decryption occurs on-the-fly ONLY when an authorized role requests to view the file.
 * 
 * Production Note: In production, key material is held within a Hardware Security Module (HSM)
 * or cloud Key Management Service (AWS KMS, Google Cloud KMS, or Azure Key Vault) with envelope encryption.
 */

const crypto = require('crypto');

// Server-held master secret key (32 bytes for AES-256)
// In production, loaded via process.env.SECURECHAIN_KMS_KEY or cloud KMS client
const MASTER_KEY = crypto.scryptSync(
  process.env.ENCRYPTION_SECRET || 'SecureChain-DMS-MHA-India-Sovereign-Key-2026', 
  'salt-mha-sovereign-vault', 
  32
);

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

/**
 * Encrypts plain text or binary payload using AES-256-GCM
 * @param {string|Buffer} plainData 
 * @returns {Object} { encryptedData: hex, iv: hex, authTag: hex, algorithm: string, keyId: string }
 */
function encryptAtRest(plainData) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
  
  const text = typeof plainData === 'string' ? plainData : JSON.stringify(plainData);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    algorithm: ALGORITHM,
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag,
    keyId: "MHA-KMS-ROOT-V1",
    encryptedAt: new Date().toISOString(),
    status: "ENCRYPTED_AT_REST"
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload on-the-fly for authorized viewers
 * @param {Object} encryptedPayload 
 * @param {string} requesterRole 
 * @returns {string} Plain text data
 */
function decryptOnTheFly(encryptedPayload, requesterRole) {
  // Permission Matrix check: Citizen, Police, Judicial, Forensic, Auditor have scoped decryption rights
  const AUTHORIZED_ROLES = ['POLICE', 'JUDICIAL', 'FORENSIC', 'AUDITOR', 'CITIZEN'];
  if (!requesterRole || !AUTHORIZED_ROLES.includes(requesterRole.toUpperCase())) {
    const error = new Error("ACCESS DENIED: Unauthorized role cannot request on-the-fly decryption.");
    error.status = 403;
    throw error;
  }

  if (!encryptedPayload || !encryptedPayload.encryptedData) {
    return encryptedPayload;
  }

  const iv = Buffer.from(encryptedPayload.iv, 'hex');
  const authTag = Buffer.from(encryptedPayload.authTag, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedPayload.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encryptAtRest,
  decryptOnTheFly
};
