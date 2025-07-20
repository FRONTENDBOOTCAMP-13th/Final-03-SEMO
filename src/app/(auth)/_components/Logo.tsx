import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Image src="/assets/unistuffLogo.svg" alt="UniStuff 로고" width={69} height={69} />
      <h1 className="font-extrabold text-35 font-pretendard,sans-serif, color-uni-black">UniStuff</h1>
    </div>
  );
}
