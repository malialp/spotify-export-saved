/**
 * Track List Component
 * Virtualized list of tracks using react-window
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { FixedSizeList } from "react-window";
import { TrackRow } from "./TrackRow";

/**
 * Table header component
 */
function TableHeader() {
  return (
    <div className="flex items-center p-2 md:p-3 bg-white/10 backdrop-blur-sm font-medium text-light/80 text-xs md:text-sm border-b border-tableBorder flex-shrink-0">
      <div className="w-10 md:w-12 text-center hidden sm:block">#</div>
      <div className="w-10 md:w-12 flex-shrink-0" />
      <div className="flex-1 px-2 md:px-3">Şarkı</div>
      <div className="w-1/4 px-2 hidden lg:block">Albüm</div>
      <div className="w-14 md:w-16 text-center hidden md:block">Süre</div>
    </div>
  );
}

/**
 * TrackList component
 * @param {Object} props - Component props
 * @param {Array} props.tracks - Array of track objects
 */
export function TrackList({ tracks }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, []);

  useEffect(() => {
    // Initial measurement with small delay for layout
    const initialTimeout = setTimeout(updateDimensions, 50);

    // ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(initialTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-light/60">
        <p>Henüz kayıtlı şarkı bulunamadı.</p>
      </div>
    );
  }

  // Responsive item size
  const itemSize = window.innerWidth < 768 ? 56 : 64;

  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
      <TableHeader />
      <div ref={containerRef} className="flex-1 min-h-0">
        {dimensions.height > 0 && dimensions.width > 0 && (
          <FixedSizeList
            height={dimensions.height}
            width={dimensions.width}
            itemCount={tracks.length}
            itemData={tracks}
            itemSize={itemSize}
            overscanCount={10}
          >
            {TrackRow}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
}

export default TrackList;
