import { ArrowLeft, Bell } from "lucide-react";

const ChatHeader = () => {
  return (
    <header className="flex min-w-[320px] w-full max-w-[480px] items-center justify-between px-4 py-3">
      <button className="text-black">
        <ArrowLeft size={24} strokeWidth={2}></ArrowLeft>
      </button>
      <h1 className="font-bold text-black text-18">채팅</h1>
      <button className="text-black">
        <Bell size={24} strokeWidth={2}></Bell>
      </button>
    </header>
  );
};

export default ChatHeader;
