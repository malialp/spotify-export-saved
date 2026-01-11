/**
 * PKCE (Proof Key for Code Exchange) Crypto Utilities
 * Used for secure OAuth 2.0 authorization without client secret
 */

/**
 * Generates a cryptographically random string for code verifier
 * @param {number} length - Length of the string (43-128 characters recommended)
 * @returns {string} Random string
 */
export function generateRandomString(length = 64) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join("");
}

/**
 * Generates SHA-256 hash of the input string
 * @param {string} plain - Input string to hash
 * @returns {Promise<ArrayBuffer>} SHA-256 hash
 */
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

/**
 * Converts ArrayBuffer to base64url encoded string
 * @param {ArrayBuffer} input - ArrayBuffer to encode
 * @returns {string} Base64url encoded string
 */
function base64urlEncode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Generates code verifier for PKCE
 * @returns {string} Code verifier string
 */
export function generateCodeVerifier() {
  return generateRandomString(64);
}

/**
 * Generates code challenge from code verifier using SHA-256
 * @param {string} codeVerifier - The code verifier string
 * @returns {Promise<string>} Base64url encoded code challenge
 */
export async function generateCodeChallenge(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64urlEncode(hashed);
}
