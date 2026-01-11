/**
 * IndexedDB Service
 * Handles large data caching using IndexedDB (supports 50MB+ data)
 */

const DB_NAME = 'SpotifyExportDB';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

let db = null;

/**
 * Opens/initializes the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Create object store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Saves tracks to IndexedDB
 * @param {Array} tracks - Array of track objects
 * @returns {Promise<void>}
 */
export async function saveTracks(tracks) {
  try {
    const database = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Clear existing data first
      store.clear();
      
      // Store tracks with metadata
      const data = {
        id: 'cached_tracks',
        tracks: tracks,
        timestamp: Date.now(),
      };
      
      const request = store.put(data);
      
      request.onerror = () => reject(new Error('Failed to save tracks'));
      request.onsuccess = () => {
        console.log(`💾 Saved ${tracks.length} tracks to IndexedDB`);
        resolve();
      };
    });
  } catch (error) {
    console.error('IndexedDB save error:', error);
  }
}

/**
 * Loads tracks from IndexedDB
 * @param {number} maxAgeMs - Maximum cache age in milliseconds
 * @returns {Promise<{tracks: Array, cacheAge: number}|null>}
 */
export async function loadTracks(maxAgeMs) {
  try {
    const database = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('cached_tracks');
      
      request.onerror = () => reject(new Error('Failed to load tracks'));
      request.onsuccess = () => {
        const data = request.result;
        
        if (!data) {
          resolve(null);
          return;
        }
        
        const age = Date.now() - data.timestamp;
        
        // Check if cache is expired
        if (age > maxAgeMs) {
          console.log('📦 Cache expired, clearing...');
          clearTracks();
          resolve(null);
          return;
        }
        
        const cacheAgeMinutes = Math.floor(age / 60000);
        console.log(`📦 Loaded ${data.tracks.length} tracks from IndexedDB (${cacheAgeMinutes} min old)`);
        
        resolve({
          tracks: data.tracks,
          cacheAge: cacheAgeMinutes,
        });
      };
    });
  } catch (error) {
    console.error('IndexedDB load error:', error);
    return null;
  }
}

/**
 * Clears all cached tracks
 * @returns {Promise<void>}
 */
export async function clearTracks() {
  try {
    const database = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = () => reject(new Error('Failed to clear tracks'));
      request.onsuccess = () => {
        console.log('🗑️ Cleared IndexedDB cache');
        resolve();
      };
    });
  } catch (error) {
    console.error('IndexedDB clear error:', error);
  }
}

/**
 * Gets the size of cached data (approximate)
 * @returns {Promise<string>}
 */
export async function getCacheSize() {
  try {
    const database = await openDB();
    
    return new Promise((resolve) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('cached_tracks');
      
      request.onsuccess = () => {
        if (!request.result) {
          resolve('0 MB');
          return;
        }
        
        const sizeBytes = new Blob([JSON.stringify(request.result)]).size;
        const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
        resolve(`${sizeMB} MB`);
      };
      
      request.onerror = () => resolve('? MB');
    });
  } catch {
    return '? MB';
  }
}

