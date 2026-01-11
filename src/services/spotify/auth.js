/**
 * Spotify Authentication Service
 * Implements PKCE (Proof Key for Code Exchange) OAuth 2.0 flow
 */

import { SPOTIFY_CONFIG } from '../../config/constants';
import { generateCodeVerifier, generateCodeChallenge } from '../../utils/crypto';
import {
  storeCodeVerifier,
  getCodeVerifier,
  clearCodeVerifier,
  storeTokens,
  clearAuthStorage,
} from '../storage';

/**
 * Initiates the PKCE authorization flow
 * Generates code verifier/challenge and redirects to Spotify login
 */
export async function initiateLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code verifier for later token exchange
  storeCodeVerifier(codeVerifier);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    scope: SPOTIFY_CONFIG.SCOPES.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token
 * @param {string} code - Authorization code from callback
 * @returns {Promise<Object>} Token response
 * @throws {Error} If code verifier is missing or exchange fails
 */
export async function exchangeCodeForToken(code) {
  const codeVerifier = getCodeVerifier();

  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please try logging in again.');
  }

  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  // Clear code verifier after use
  clearCodeVerifier();

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || 'Failed to exchange code for token');
  }

  const tokenData = await response.json();
  storeTokens(tokenData);

  return tokenData;
}

/**
 * Refreshes the access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New token response
 */
export async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    clearAuthStorage();
    throw new Error('Failed to refresh token. Please log in again.');
  }

  const tokenData = await response.json();
  storeTokens(tokenData);

  return tokenData;
}

/**
 * Logs out the user by clearing all auth storage
 */
export function logout() {
  clearAuthStorage();
  window.location.href = SPOTIFY_CONFIG.REDIRECT_URI;
}

/**
 * Parses the callback URL for authorization code or error
 * @returns {Object} Parsed callback data
 */
export function parseCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  return { code, error };
}

/**
 * Clears the URL parameters after callback processing
 */
export function clearCallbackParams() {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, document.title, url.toString());
}

