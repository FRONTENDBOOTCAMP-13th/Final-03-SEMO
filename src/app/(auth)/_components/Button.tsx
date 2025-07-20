interface ButtonProps {
  type?: "primary" | "outline" | "kakao" | "google";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({ type = "primary", onClick, children, className, ...props }: ButtonProps) {
  const base = "w-full py-3 rounded-md font-semibold text-sm flex justify-center items-center";

  const styleMap = {
    primary: `${base} bg-uni-blue-400 text-white`,
    outline: `${base} border border-[#0070f3] text-[#0070f3]`,
    kakao: `${base} bg-[#FEE500] text-black`,
    google: `${base} border border-gray-300 text-black`,
  };

  return (
    <button onClick={onClick} className={`${styleMap[type]} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}
