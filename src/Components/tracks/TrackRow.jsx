/**
 * Track Row Component
 * Renders a single track item in the virtualized list
 */

import { memo } from "react";
import { formatDuration } from "../../utils/format";

/**
 * TrackRow component - memoized for performance
 * @param {Object} props - Component props from react-window
 */
function TrackRowComponent({ data, index, style }) {
  const item = data[index];

  if (!item?.track) {
    return <div style={style} className="p-2 text-light/50">Yükleniyor...</div>;
  }

  const track = item.track;
  const albumImage = track.album?.images?.at(-1)?.url;
  const artists = track.artists?.map((a) => a.name).join(", ") || "Bilinmeyen";

  return (
    <div
      style={style}
      className="flex items-center p-2 bg-white/5 border-b border-tableBorder hover:bg-white/10 transition-colors"
    >
      {/* Index */}
      <div className="w-10 md:w-12 text-center text-light/50 text-xs md:text-sm hidden sm:block">
        {index + 1}
      </div>

      {/* Album Art */}
      <div className="w-10 md:w-12 flex-shrink-0">
        {albumImage ? (
          <img
            src={albumImage}
            alt={track.album?.name}
            className="w-8 h-8 md:w-10 md:h-10 rounded shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-white/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-light/30"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 px-2 md:px-3">
        <p className="text-light font-medium truncate text-sm md:text-base">
          {track.name}
        </p>
        <p className="text-light/60 text-xs md:text-sm truncate">{artists}</p>
      </div>

      {/* Album */}
      <div className="w-1/4 px-2 hidden lg:block">
        <p className="text-light/60 text-sm truncate">{track.album?.name}</p>
      </div>

      {/* Duration */}
      <div className="w-14 md:w-16 text-center text-light/60 text-xs md:text-sm hidden md:block">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
}

export const TrackRow = memo(TrackRowComponent);
export default TrackRow;
