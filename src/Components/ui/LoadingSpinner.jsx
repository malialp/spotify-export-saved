/**
 * Loading Spinner Component
 * Animated spinner with optional message
 */

/**
 * LoadingSpinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Spinner size
 * @param {string} [props.message] - Optional loading message
 * @param {Object} [props.progress] - Optional progress indicator
 */
export function LoadingSpinner({ size = 'md', message, progress }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const progressPercent =
    progress?.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : null;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-light/20 border-t-spotify rounded-full animate-spin`}
        />
      </div>

      {message && (
        <p className="text-light/80 text-lg font-medium animate-pulse">
          {message}
        </p>
      )}

      {progressPercent !== null && (
        <div className="w-48 flex flex-col gap-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-spotify rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-light/60 text-sm text-center">
            {progress.current} / {progress.total} şarkı yüklendi
          </p>
        </div>
      )}
    </div>
  );
}

export default LoadingSpinner;

