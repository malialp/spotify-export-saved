/**
 * Footer Component
 * Application footer with credits
 */

/**
 * Footer component
 */
export function Footer() {
  return (
    <footer className="w-full py-4 px-4">
      <div className="container mx-auto text-center text-light/50 text-sm">
        <p>
          Made with{' '}
          <span className="text-red-500" aria-label="love">
            ♥
          </span>{' '}
          by{' '}
          <a
            href="https://github.com/malialp/spotify-export-saved"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spotify hover:text-spotify-light transition-colors hover:underline"
          >
            malialp
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

