import crypto from 'crypto';
import {PHASE_PRODUCTION_BUILD} from "next/constants";

// Encryption algorithm configuration
const algorithm = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

// Version byte to support future migration
const ENCRYPTION_VERSION = 0x01; // Version 1: AES-256-GCM

function getEncryptionKey(): Buffer {
    // Retrieve the Base64-encoded encryption key from the environment variable
    const keyBase64 = process.env.ENCRYPTION_KEY;
    if (!keyBase64) {
        throw new Error('The ENCRYPTION_KEY environment variable is not set.');
    }

    // Decode the key (must be 32 bytes for 256-bit encryption)
    const key = Buffer.from(keyBase64, 'base64');
    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a Base64-encoded 32-byte key.');
    }

    return key;
}

/**
 * Checks if data was encrypted with the old CBC algorithm
 */
function isLegacyCBC(data: Buffer): boolean {
    // Legacy CBC format: IV (16 bytes) + ciphertext
    // New GCM format: version (1 byte) + salt (32 bytes) + IV (16 bytes) + tag (16 bytes) + ciphertext
    // Check if data is too short for GCM format or doesn't start with version byte
    return data.length < (1 + SALT_LENGTH + IV_LENGTH + TAG_LENGTH) || data[0] !== ENCRYPTION_VERSION;
}

/**
 * Legacy decrypt function for CBC-encrypted data
 */
function decryptLegacyCBC(base64Data: string): string {
    const combinedBuffer = Buffer.from(base64Data, 'base64');
    const iv = combinedBuffer.subarray(0, 16);
    const encryptedText = combinedBuffer.subarray(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', getEncryptionKey(), iv);
    const decryptedBuffer = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final()
    ]);
    
    return decryptedBuffer.toString('utf8');
}

/**
 * Derives a key from the master key using a salt for additional security
 */
function deriveKey(masterKey: Buffer, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts a plaintext string using AES-256-GCM with authenticated encryption.
 * @param text - The plaintext string to encrypt.
 * @param associatedData - Optional additional authenticated data (AAD) for context binding.
 * @returns A Base64-encoded string containing version, salt, IV, tag, and ciphertext.
 */
export function encrypt(text: string, associatedData?: string): string {
    const masterKey = getEncryptionKey();
    
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derive encryption key from master key and salt
    const derivedKey = deriveKey(masterKey, salt);
    
    // Create cipher with derived key
    const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
    
    // Add associated data if provided (for authentication, not encrypted)
    if (associatedData) {
        cipher.setAAD(Buffer.from(associatedData, 'utf8'));
    }
    
    // Perform encryption
    const encryptedBuffer = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
    ]);
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine: version + salt + iv + tag + ciphertext
    const combinedBuffer = Buffer.concat([
        Buffer.from([ENCRYPTION_VERSION]),
        salt,
        iv,
        tag,
        encryptedBuffer
    ]);
    
    return combinedBuffer.toString('base64');
}

/**
 * Decrypts a Base64-encoded string that contains the version, salt, IV, tag, and ciphertext.
 * Supports backward compatibility with CBC-encrypted data.
 * @param base64Data - The Base64-encoded string to decrypt.
 * @param associatedData - Optional additional authenticated data (must match encryption AAD).
 * @returns The decrypted plaintext string.
 */
export function decrypt(base64Data: string, associatedData?: string): string {
    const combinedBuffer = Buffer.from(base64Data, 'base64');
    
    // Check if this is legacy CBC data
    if (isLegacyCBC(combinedBuffer)) {
        // Use legacy decryption for backward compatibility
        return decryptLegacyCBC(base64Data);
    }
    
    // Parse GCM format
    let offset = 0;
    
    // Skip version byte (already checked)
    offset += 1;
    
    // Extract components
    const salt = combinedBuffer.subarray(offset, offset + SALT_LENGTH);
    offset += SALT_LENGTH;
    
    const iv = combinedBuffer.subarray(offset, offset + IV_LENGTH);
    offset += IV_LENGTH;
    
    const tag = combinedBuffer.subarray(offset, offset + TAG_LENGTH);
    offset += TAG_LENGTH;
    
    const encryptedText = combinedBuffer.subarray(offset);
    
    // Derive key from master key and salt
    const masterKey = getEncryptionKey();
    const derivedKey = deriveKey(masterKey, salt);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, derivedKey, iv);
    
    // Set authentication tag
    decipher.setAuthTag(tag);
    
    // Add associated data if provided
    if (associatedData) {
        decipher.setAAD(Buffer.from(associatedData, 'utf8'));
    }
    
    try {
        const decryptedBuffer = Buffer.concat([
            decipher.update(encryptedText),
            decipher.final()
        ]);
        
        return decryptedBuffer.toString('utf8');
    } catch (error) {
        // Authentication failed - data may have been tampered with
        throw new Error('Decryption failed: Invalid authentication tag. Data may be corrupted or tampered.');
    }
}

// Check if the encryption key is available not in production build
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) getEncryptionKey();