function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-md bg-[#1C76D5] hover:bg-[#1c56d5] text-white py-3 px-5 flex gap-1 hover:cursor-pointer"
    >
      {props.children}
    </button>
  );
}

export default Button;
