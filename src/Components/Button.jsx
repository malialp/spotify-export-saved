const Button = ({ children, href, onClick, style }) => {
  const className =
    "cursor-pointer text-dark bg-light px-4 py-2 whitespace-nowrap hover:opacity-80 duration-200 active:opacity-90 focus:outline focus:outline-4 focus:outline-midLight focus:duration-150 focus:outline-offset-2 " +
    style;

  return href ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
