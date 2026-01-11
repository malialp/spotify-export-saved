/**
 * Local Storage Service
 * Handles persistent storage operations with JSON serialization
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * Gets an item from localStorage
 * @param {string} key - Storage key
 * @returns {*} Parsed value or null
 */
export function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

/**
 * Sets an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage setItem error:', error);
  }
}

/**
 * Removes an item from localStorage
 * @param {string} key - Storage key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage removeItem error:', error);
  }
}

/**
 * Clears all auth-related storage items
 */
export function clearAuthStorage() {
  Object.values(STORAGE_KEYS).forEach(removeItem);
}

/**
 * Gets stored access token if not expired
 * @returns {string|null} Access token or null
 */
export function getStoredAccessToken() {
  const token = getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiry = getItem(STORAGE_KEYS.TOKEN_EXPIRY);

  if (!token || !expiry) return null;

  // Check if token is expired (with 1 minute buffer)
  if (Date.now() >= expiry - 60000) {
    clearAuthStorage();
    return null;
  }

  return token;
}

/**
 * Stores auth tokens
 * @param {Object} tokenData - Token response data
 * @param {string} tokenData.access_token - Access token
 * @param {string} [tokenData.refresh_token] - Refresh token
 * @param {number} tokenData.expires_in - Expiry time in seconds
 */
export function storeTokens({ access_token, refresh_token, expires_in }) {
  setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  setItem(STORAGE_KEYS.TOKEN_EXPIRY, Date.now() + expires_in * 1000);

  if (refresh_token) {
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
  }
}

/**
 * Gets stored code verifier for PKCE
 * @returns {string|null} Code verifier or null
 */
export function getCodeVerifier() {
  return getItem(STORAGE_KEYS.CODE_VERIFIER);
}

/**
 * Stores code verifier for PKCE
 * @param {string} verifier - Code verifier
 */
export function storeCodeVerifier(verifier) {
  setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);
}

/**
 * Removes code verifier after use
 */
export function clearCodeVerifier() {
  removeItem(STORAGE_KEYS.CODE_VERIFIER);
}

