/**
 * Reusable Button Component
 * Supports both button and anchor element rendering
 */

const variants = {
  primary:
    'bg-spotify text-white hover:bg-spotify-dark active:bg-spotify-darker',
  secondary:
    'bg-light text-dark hover:opacity-80 active:opacity-90',
  outline:
    'border-2 border-light text-light hover:bg-light hover:text-dark',
  ghost:
    'text-light hover:bg-white/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.href] - If provided, renders as anchor
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.variant='secondary'] - Visual variant
 * @param {string} [props.size='md'] - Size variant
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-spotify focus:ring-offset-2 focus:ring-offset-dark disabled:opacity-50 disabled:cursor-not-allowed';

  const combinedClasses = [
    baseClasses,
    variants[variant] || variants.secondary,
    sizes[size] || sizes.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

