function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-md bg-[#1C76D5] hover:bg-[#1c56d5] text-white py-1 px-2 sm:py-3 sm:px-5 flex gap-1 hover:cursor-pointer ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
}

export default Button;
