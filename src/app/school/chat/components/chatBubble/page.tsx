import Image from "next/image";

interface ChatBubbleProps {
  msg: {
    content: string;
    nickName: string;
    isMine: boolean;
  };
}

// const ChatBubble = () => {
//   return (
//     <>
//       {/* {내가 보낸 메시지} */}
//       <div className="flex justify-end items-end gap-2 min-h-[104px] p-4">
//         <div className="bg-uni-blue-400 px-4 py-3 text-uni-white max-w-[70%] rounded-xl text-16">
//           영원할 줄 알았던 사랑도 저물고 이젠 그 흔한 친구마저 떠나가네요. 나이가 들어서 나 철이 안드나봐요. 왜 이렇게
//           불안할까.
//         </div>
//         <div>
//           <Image src="/assets/defaultImg.png" alt="내 아바타" width={40} height={40} className="rounded-full" />
//           <span className="text-12 flex justify-center">나</span>
//         </div>
//       </div>

//       {/* {상대가 보낸 메시지} */}
//       <div className="flex justify-start items-end gap-2 min-h-[104px] p-4">
//         <div>
//           <Image src="/assets/defaultImg.png" alt="상대 아바타" width={40} height={40} className="rounded-full" />
//           <span className="text-12 flex justify-center">김민지</span>
//         </div>
//         <div className="bg-uni-gray-200 px-4 py-3 text-uni-black max-w-[70%] rounded-xl text-16">
//           영원할 줄 알았던 사랑도 저물고 이젠 그 흔한 친구마저 떠나가네요. 나이가 들어서 나 철이 안드나봐요. 왜 이렇게
//           불안할까.
//         </div>
//       </div>
//     </>
//   );
// };
const ChatBubble = ({ msg }: ChatBubbleProps) => {
  return msg.isMine ? (
    // 내가 보낸 메시지
    <div className="flex justify-end items-end gap-2 min-h-[104px] p-4">
      <div className="bg-uni-blue-400 px-4 py-3 text-uni-white max-w-[70%] rounded-xl text-16">{msg.content}</div>
      <div>
        <Image src="/assets/defaultImg.png" alt="내 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">나</span>
      </div>
    </div>
  ) : (
    // 상대가 보낸 메시지
    <div className="flex justify-start items-end gap-2 min-h-[104px] p-4">
      <div>
        <Image src="/assets/defaultImg.png" alt="상대 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">{msg.nickName}</span>
      </div>
      <div className="bg-uni-gray-200 px-4 py-3 text-uni-black max-w-[70%] rounded-xl text-16">{msg.content}</div>
    </div>
  );
};

export default ChatBubble;
