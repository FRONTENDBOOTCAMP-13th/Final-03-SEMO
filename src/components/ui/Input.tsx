interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export default function Input({ type = "text", placeholder, value, onChange }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-uni-gray-200 rounded-lg p-4 text-16 focus:outline-uni-blue-400 focus:border-uni-blue-400 bg-uni-gray-100"
    />
  );
}
