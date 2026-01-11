/**
 * useTracks Hook
 * Manages fetching and state of user's saved tracks with IndexedDB caching
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { fetchSavedTracks } from "../services/spotify";
import { useAuth } from "../context/AuthContext";
import { saveTracks, loadTracks, clearTracks, getCacheSize } from "../services/indexedDB";
import { CACHE_CONFIG } from "../config/constants";

/**
 * Track loading states
 */
export const TRACKS_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * Custom hook for managing saved tracks
 * @param {Object} options - Hook options
 * @param {boolean} [options.autoFetch=true] - Whether to fetch tracks automatically
 * @returns {Object} Tracks state and methods
 */
export function useTracks({ autoFetch = true } = {}) {
  const { accessToken, handleUnauthorized } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState(TRACKS_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isFromCache, setIsFromCache] = useState(false);
  const [cacheAge, setCacheAgeState] = useState(null);
  const [cacheSize, setCacheSize] = useState(null);

  /**
   * Fetches saved tracks from Spotify API (bypasses cache)
   */
  const fetchFromApi = useCallback(
    async (showProgress = true) => {
      if (!accessToken) return;

      setStatus(TRACKS_STATUS.LOADING);
      setError(null);
      setIsFromCache(false);
      if (showProgress) {
        setProgress({ current: 0, total: 0 });
      }

      try {
        const fetchedTracks = await fetchSavedTracks(
          accessToken,
          showProgress
            ? (current, total) => {
                setProgress({ current: Math.min(current, total), total });
              }
            : undefined
        );

        // Save to IndexedDB cache
        await saveTracks(fetchedTracks);
        setCacheAgeState(0);
        
        // Update cache size
        const size = await getCacheSize();
        setCacheSize(size);

        setTracks(fetchedTracks);
        setStatus(TRACKS_STATUS.SUCCESS);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          handleUnauthorized();
          return;
        }

        setError(err.message);
        setStatus(TRACKS_STATUS.ERROR);
      }
    },
    [accessToken, handleUnauthorized]
  );

  /**
   * Loads tracks from cache or fetches from API
   */
  const loadTracksFromCacheOrApi = useCallback(async () => {
    if (!accessToken) return;

    // Try to get from IndexedDB cache first
    const cached = await loadTracks(CACHE_CONFIG.TRACKS_TTL);

    if (cached && cached.tracks.length > 0) {
      setTracks(cached.tracks);
      setStatus(TRACKS_STATUS.SUCCESS);
      setIsFromCache(true);
      setCacheAgeState(cached.cacheAge);
      
      // Get cache size
      const size = await getCacheSize();
      setCacheSize(size);
      return;
    }

    // No cache, fetch from API
    await fetchFromApi();
  }, [accessToken, fetchFromApi]);

  /**
   * Auto-fetch on mount if enabled
   */
  useEffect(() => {
    if (autoFetch && accessToken) {
      loadTracksFromCacheOrApi();
    }
  }, [autoFetch, accessToken, loadTracksFromCacheOrApi]);

  /**
   * Force refresh - clears cache and fetches from API
   */
  const forceRefresh = useCallback(async () => {
    await clearTracks();
    await fetchFromApi(true);
  }, [fetchFromApi]);

  /**
   * Refetch tracks (uses cache if available)
   */
  const refetch = useCallback(() => {
    loadTracksFromCacheOrApi();
  }, [loadTracksFromCacheOrApi]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(async () => {
    await clearTracks();
    setCacheSize(null);
  }, []);

  /**
   * Memoized tracks for performance
   */
  const memoizedTracks = useMemo(() => tracks, [tracks]);

  return {
    tracks: memoizedTracks,
    status,
    error,
    progress,
    isLoading: status === TRACKS_STATUS.LOADING,
    isSuccess: status === TRACKS_STATUS.SUCCESS,
    isError: status === TRACKS_STATUS.ERROR,
    isFromCache,
    cacheAge,
    cacheSize,
    refetch,
    forceRefresh,
    clearCache,
  };
}
