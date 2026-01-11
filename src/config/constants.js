// Spotify Configuration
export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || 'http://127.0.0.1:3000/',
  SCOPES: ['user-library-read'],
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  API_BASE_URL: 'https://api.spotify.com/v1',
};

// Storage Keys (localStorage - only for auth)
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  TOKEN_EXPIRY: 'spotify_token_expiry',
  CODE_VERIFIER: 'spotify_code_verifier',
};

// Cache Configuration
export const CACHE_CONFIG = {
  // Cache TTL: 1 hour (in milliseconds)
  TRACKS_TTL: 60 * 60 * 1000,
};

// API Limits
export const API_LIMITS = {
  TRACKS_PER_REQUEST: 50,
};

