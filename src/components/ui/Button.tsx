interface ButtonProps {
  type?: "primary" | "outline" | "kakao" | "google";
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  type = "primary",
  buttonType = "button",
  onClick,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    "w-full py-3 rounded-lg font-semibold text-16 cursor-pointer flex justify-center items-center focus:outline-uni-blue-400 focus:border-uni-blue-400";

  const styleMap = {
    primary: `${base} bg-uni-blue-400 text-uni-white`,
    outline: `${base} border border-uni-blue-400 text-uni-blue-400`,
    kakao: `${base} bg-uni-yellow text-black`,
    google: `${base} border border-uni-gray-300 text-black`,
  };

  return (
    <button type={buttonType} onClick={onClick} className={`${styleMap[type]} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}
