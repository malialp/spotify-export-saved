/**
 * Spotify Authentication Service
 * Implements Standard Authorization Code Flow with Client Secret
 */

import { SPOTIFY_CONFIG } from '../../config/constants';
import { storeTokens, clearAuthStorage } from '../storage';

/**
 * Creates Basic Authorization header with Client ID and Client Secret
 * @returns {string} Basic auth header value
 */
function getBasicAuthHeader() {
  const credentials = `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`;
  return `Basic ${btoa(credentials)}`;
}

/**
 * Initiates the standard Authorization Code flow
 * Redirects to Spotify login
 */
export async function initiateLogin() {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    scope: SPOTIFY_CONFIG.SCOPES.join(' '),
  });

  window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token using Client Secret
 * @param {string} code - Authorization code from callback
 * @returns {Promise<Object>} Token response
 * @throws {Error} If exchange fails
 */
export async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
  });

  const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: getBasicAuthHeader(),
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || 'Failed to exchange code for token');
  }

  const tokenData = await response.json();
  storeTokens(tokenData);

  return tokenData;
}

/**
 * Refreshes the access token using refresh token and Client Secret
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New token response
 */
export async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: getBasicAuthHeader(),
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

