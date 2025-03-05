function Banner() {
  return (
    <div className="bg-[#F0F0F0] text-[#5B5B5B] text-sm flex justify-center">
      <span className="flex justify-start gap-2 w-6xl max-w-6xl py-1 px-4">
        <img
          src="/singapore-lion.svg"
          alt="singapore lion logo"
          width={16}
          height={16}
        ></img>
        <p>
          An Official Website of the <b>Singapore Government</b>
        </p>
      </span>
    </div>
  );
}

export default Banner;