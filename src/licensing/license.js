// License storage key
const LICENSE_KEY = 'offcode_license';

// Must match the secret used in the backend
const JWT_SECRET = import.meta.env.VITE_LICENSE_SECRET || 'offcode-license-secret-change-in-prod';

// --- Internal JWT helpers (no external deps) ---

function base64UrlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '===='.slice(str.length % 4);
  return atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

async function verifyJWTSignature(token, secret) {
  try {
    const [headerB64, payloadB64, sigB64] = token.split('.');
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );
    const sigBytes = Uint8Array.from(base64UrlDecode(sigB64), c => c.charCodeAt(0));
    const data = enc.encode(`${headerB64}.${payloadB64}`);
    return await crypto.subtle.verify('HMAC', key, sigBytes, data);
  } catch {
    return false;
  }
}

// --- Public API ---

export function saveLicense(token) {
  localStorage.setItem(LICENSE_KEY, token);
}

export function clearLicense() {
  localStorage.removeItem(LICENSE_KEY);
}

export function getRawLicense() {
  return localStorage.getItem(LICENSE_KEY);
}

/**
 * Returns { tier: 'free'|'pro'|'ultimate', valid: bool }
 * Validates offline (signature + expiry). Always returns 'free' on failure.
 */
export async function validateLicense() {
  const token = getRawLicense();
  if (!token) return { tier: 'free', valid: false };

  const payload = parseJWT(token);
  if (!payload) return { tier: 'free', valid: false };

  // Check expiry if present
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    clearLicense();
    return { tier: 'free', valid: false };
  }

  const ok = await verifyJWTSignature(token, JWT_SECRET);
  if (!ok) {
    clearLicense();
    return { tier: 'free', valid: false };
  }

  return { tier: payload.tier || 'free', valid: true };
}

/**
 * Synchronous tier read — returns last-known tier from parsed token.
 * Use for rendering; use validateLicense() on app startup for security.
 */
export function getTier() {
  const token = getRawLicense();
  if (!token) return 'free';
  const payload = parseJWT(token);
  if (!payload) return 'free';
  if (payload.exp && Date.now() / 1000 > payload.exp) return 'free';
  return payload.tier || 'free';
}
