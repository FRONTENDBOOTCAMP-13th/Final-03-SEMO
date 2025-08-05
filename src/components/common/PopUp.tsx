// const PopUp = () => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white min-w-[320px] w-full max-w-[480px] px-6 py-6 text-center">
//         {/* 헤더 */}
//         <h1 className="text-18 font-bold text-black mb-4">알림</h1>

//         {/* 메시지 */}
//         <p className="text-sm text-uni-black leading-relaxed m-3">
//           이 거래를 시작하려면 <br />
//           <span className="text-uni-blue-500 font-medium">채팅</span>을 시작해야 합니다.
//         </p>

//         {/* 닫기 버튼 */}
//         <button className=" w-full bg-uni-blue-400 text-white rounded-md py-3 text-16 font-bold mb-2">닫기</button>

//         {/* 체크박스 */}
//         <label className="flex items-center gap-2 text-12 text-uni-black">
//           <input type="checkbox" />
//           <span>하루동안 안 뜨게 하기</span>
//         </label>
//       </div>
//     </div>
//   );
// };
// export default PopUp;

const PopUp = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white min-w-[320px] w-full max-w-[480px] px-6 py-6 text-center">
        {/* 헤더 */}
        <h1 className="text-18 font-bold text-black mb-4">알림</h1>

        {/* 메시지 */}
        <p className="text-sm text-uni-black leading-relaxed m-3">
          이 거래를 완료하려면 <br />
          <span className="text-uni-blue-500 font-medium">승인하기 버튼</span>을 눌러서 완료해야 합니다.
        </p>

        {/* 닫기 버튼 */}
        <button className="w-full bg-uni-blue-400 text-white rounded-md py-3 text-16 font-bold mb-2" onClick={onClose}>
          닫기
        </button>

        {/* 체크박스 */}
        {/* <label className="flex items-center gap-2 text-12 text-uni-black">
          <input type="checkbox" />
          <span>하루동안 안 뜨게 하기</span>
        </label> */}
      </div>
    </div>
  );
};

export default PopUp;
