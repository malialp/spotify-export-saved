/**
 * File download utility functions
 */

import { formatDuration } from "./format";

/**
 * Creates and triggers a file download
 * @param {Object} options - Download options
 * @param {string} options.data - File content
 * @param {string} options.fileName - Name of the file
 * @param {string} options.fileType - MIME type of the file
 */
export function downloadFile({ data, fileName, fileType }) {
  const blob = new Blob([data], { type: fileType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Exports tracks data as JSON file (raw API format)
 * @param {Array} tracks - Array of track objects
 */
export function exportAsJson(tracks) {
  downloadFile({
    data: JSON.stringify(tracks, null, 2),
    fileName: `spotify_saved_tracks_${Date.now()}.json`,
    fileType: "application/json",
  });
}

/**
 * Escapes CSV field value
 * @param {string} value - Field value
 * @returns {string} Escaped value
 */
function escapeCSVField(value) {
  if (value == null) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Exports tracks data as CSV file
 * @param {Array} tracks - Array of track objects
 */
export function exportAsCsv(tracks) {
  const headers = ["#", "Title", "Artist", "Album", "Added At", "Duration"];

  const rows = tracks.map((item, index) => {
    const artists = item.track.artists.map((a) => a.name).join("; ");
    return [
      index + 1,
      escapeCSVField(item.track.name),
      escapeCSVField(artists),
      escapeCSVField(item.track.album.name),
      item.added_at,
      formatDuration(item.track.duration_ms),
    ].join(",");
  });

  downloadFile({
    data: [headers.join(","), ...rows].join("\n"),
    fileName: `spotify_saved_tracks_${Date.now()}.csv`,
    fileType: "text/csv;charset=utf-8",
  });
}
