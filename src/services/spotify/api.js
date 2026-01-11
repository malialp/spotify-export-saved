/**
 * Spotify API Service
 * Handles all Spotify Web API requests with rate limiting protection
 */

import { SPOTIFY_CONFIG, API_LIMITS } from '../../config/constants';

/**
 * Creates authenticated headers for API requests
 * @param {string} token - Access token
 * @returns {Object} Headers object
 */
function createHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Delays execution for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Makes an authenticated request to Spotify API with retry logic
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} token - Access token
 * @param {Object} [options] - Fetch options
 * @param {number} [retries=3] - Number of retries
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, token, options = {}, retries = 3) {
  const url = `${SPOTIFY_CONFIG.API_BASE_URL}${endpoint}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...createHeaders(token),
          ...options.headers,
        },
      });

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
        const waitTime = (retryAfter + 1) * 1000; // Add 1 second buffer
        
        console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error('UNAUTHORIZED');
        }

        // For server errors, retry
        if (response.status >= 500 && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`Server error. Retrying in ${waitTime}ms...`);
          await delay(waitTime);
          continue;
        }

        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Network errors - retry with exponential backoff
      if (error.name === 'TypeError' && attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.warn(`Network error. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Fetches all saved tracks from user's library
 * Uses pagination with rate limiting protection
 * @param {string} token - Access token
 * @param {Function} [onProgress] - Progress callback (current, total)
 * @returns {Promise<Array>} Array of saved track objects
 */
export async function fetchSavedTracks(token, onProgress) {
  // First, get the total count
  const initialResponse = await apiRequest('/me/tracks?limit=1', token);
  const total = initialResponse.total;

  if (total === 0) {
    return [];
  }

  // Calculate number of requests needed
  const limit = API_LIMITS.TRACKS_PER_REQUEST;
  const offsets = [];

  for (let offset = 0; offset < total; offset += limit) {
    offsets.push(offset);
  }

  // Fetch pages with controlled concurrency and delays
  const concurrencyLimit = 2; // Reduced from 5 to avoid rate limits
  const delayBetweenBatches = 300; // 300ms delay between batches
  const allTracks = [];
  let completed = 0;

  for (let i = 0; i < offsets.length; i += concurrencyLimit) {
    const batch = offsets.slice(i, i + concurrencyLimit);

    const batchResults = await Promise.all(
      batch.map(async (offset) => {
        const response = await apiRequest(`/me/tracks?offset=${offset}&limit=${limit}`, token);
        completed++;
        onProgress?.(Math.min(completed * limit, total), total);
        return response.items;
      })
    );

    batchResults.forEach((items) => {
      allTracks.push(...items);
    });

    // Add delay between batches to avoid rate limiting
    if (i + concurrencyLimit < offsets.length) {
      await delay(delayBetweenBatches);
    }
  }

  // Sort by added date (newest first)
  allTracks.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));

  return allTracks;
}

/**
 * Fetches current user's profile
 * @param {string} token - Access token
 * @returns {Promise<Object>} User profile data
 */
export async function fetchUserProfile(token) {
  return apiRequest('/me', token);
}
