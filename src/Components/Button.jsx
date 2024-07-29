const Button = (props) => {
  return (
    <button className="font-poppins text-dark bg-light px-4 py-2 rounded-[10px] text-[18px] font-medium whitespace-nowrap hover:opacity-80 duration-200 active:opacity-90 focus:outline focus:outline-4 focus:outline-midLight focus:duration-150 focus:outline-offset-2">
      {props.children}
    </button>
  );
};

export default Button;
