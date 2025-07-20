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
      className="w-full border border-uni-gray-200 rounded-md px-4 py-3 text-sm focus:outline-uni-blue-400 focus:border-uni-blue-400 bg-uni-gray-100"
    />
  );
}
