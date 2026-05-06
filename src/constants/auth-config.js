// ============================================
// Sogni SDK - Secure Access Configuration
// ============================================
// Credentials are XOR-encoded with the app key.
// Access codes are loaded from .env and device-locked.
// ============================================

const _K = 'sogni-helper-app-1';

// XOR decode
function _d(encoded) {
  try {
    const raw = atob(encoded);
    return raw.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ _K.charCodeAt(i % _K.length))
    ).join('');
  } catch {
    return '';
  }
}

// Encoded credentials (XOR + base64)
const _U = 'AAABGl0fWVQ=';
const _P = 'Pw4PARtIKFRdQlc=';

// Parse access codes from env: "CODE1:user1,CODE2:user2"
function loadAccessCodes() {
  const raw = import.meta.env.VITE_ACCESS_CODES || '';
  const codes = {};
  if (raw) {
    raw.split(',').forEach(entry => {
      const [code, user] = entry.trim().split(':');
      if (code && user) {
        codes[code.toUpperCase()] = { user: user.trim() };
      }
    });
  }
  return codes;
}

const ACCESS_CODES = loadAccessCodes();

// Generate a device fingerprint hash
function getDeviceFingerprint() {
  const raw = [
    navigator.userAgent,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.hardwareConcurrency || 'unknown'
  ].join('|');

  // Simple hash (djb2)
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return hash.toString(36);
}

// Validate an access code and enforce device lock
export function validateAccessCode(code) {
  const normalizedCode = code.toUpperCase();
  const entry = ACCESS_CODES[normalizedCode];
  if (!entry) {
    return { valid: false, error: 'Invalid access code.' };
  }

  const fingerprint = getDeviceFingerprint();
  const storageKey = `sogni_device_${normalizedCode}`;
  const storedFingerprint = localStorage.getItem(storageKey);

  if (storedFingerprint && storedFingerprint !== fingerprint) {
    return {
      valid: false,
      error: 'This access code is already bound to another device.'
    };
  }

  // Bind to this device on first use
  if (!storedFingerprint) {
    localStorage.setItem(storageKey, fingerprint);
  }

  return { valid: true, user: entry.user };
}

// Get the shared Sogni credentials (decoded at runtime only)
export function getSogniCredentials() {
  return {
    username: _d(_U),
    password: _d(_P)
  };
}

// Check if a stored session exists
export function getStoredSession() {
  try {
    const data = localStorage.getItem('sogni_auth');
    if (data) return JSON.parse(data);
  } catch {
    // corrupted
  }
  return null;
}

// Save session
export function saveSession(authType, extra = {}) {
  localStorage.setItem('sogni_auth', JSON.stringify({ authType, ...extra }));
}

// Clear session
export function clearSession() {
  localStorage.removeItem('sogni_auth');
}
