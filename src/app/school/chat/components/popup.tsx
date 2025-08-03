interface PopUpProps {
  onClose: () => void;
  onConfirm: () => void;
}

const PopUp = ({ onClose, onConfirm }: PopUpProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white min-w-[320px] w-full max-w-[480px] px-6 py-6 text-center">
        {/* 헤더 */}
        <h1 className="text-18 font-bold text-black mb-4">알림</h1>
        <p className="text-sm text-uni-black leading-relaxed m-3">이 거래를 완료하시겠습니까?</p>

        {/* 확인 버튼 */}
        <button
          className="w-full bg-uni-blue-500 text-white rounded-md py-3 text-16 font-bold mb-2"
          onClick={onConfirm}
        >
          거래 완료
        </button>
        {/* 닫기 버튼 */}
        <button className="w-full bg-gray-200 text-uni-black rounded-md py-3 text-16 font-bold" onClick={onClose}>
          최소
        </button>
      </div>
    </div>
  );
};
export default PopUp;
