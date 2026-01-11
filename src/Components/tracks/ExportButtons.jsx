/**
 * Export Buttons Component
 * Provides CSV and JSON export functionality
 */

import { Button } from '../ui';
import { exportAsCsv, exportAsJson } from '../../utils/download';

/**
 * ExportButtons component
 * @param {Object} props - Component props
 * @param {Array} props.tracks - Tracks to export
 * @param {boolean} [props.disabled] - Disabled state
 */
export function ExportButtons({ tracks, disabled = false }) {
  const handleExportCsv = () => {
    if (tracks?.length > 0) {
      exportAsCsv(tracks);
    }
  };

  const handleExportJson = () => {
    if (tracks?.length > 0) {
      exportAsJson(tracks);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={handleExportCsv}
        disabled={disabled || !tracks?.length}
        variant="secondary"
        size="md"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        CSV
      </Button>

      <Button
        onClick={handleExportJson}
        disabled={disabled || !tracks?.length}
        variant="secondary"
        size="md"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        JSON
      </Button>
    </div>
  );
}

export default ExportButtons;

