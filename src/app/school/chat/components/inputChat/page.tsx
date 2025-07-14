import { ImageIcon } from "lucide-react";

const InputChat = () => {
  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3 ">
      <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
        <input
          type="text"
          placeholder="메시지 보내기"
          className="w-full bg-transparent outline-none ml-4 my-2 mr-2 placeholder-uni-gray-600 text-16 text-uni-black"
        />
        <button className="text-uni-black ml-[6px] my-[14px] mr-[14px]">
          <ImageIcon size={20} />
        </button>
      </div>
    </div>
  );
};
export default InputChat;
