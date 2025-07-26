const TradeInfoBox = () => {
  return (
    <div className="w-full min-w-[360px] max-w-[480px] p-4">
      <div className="mb-3 flex flex-col justify-center border border-[#DBE0E5] rounded-[12px] h-20 w-full">
        <p className="text-uni-black text-14 font-bold px-4">거래 장소</p>
        <p className="text-uni-gray-600 text-14 px-4">기숙사 무인 택배 앞 창고</p>
      </div>
      <div className="mb-3 flex flex-col justify-center border border-[#DBE0E5] rounded-[12px] h-20 w-full">
        <p className="text-uni-black text-14 font-bold px-4">계좌 번호</p>
        <p className="text-uni-gray-600 text-14 px-4">농협 1234-1234-1234-23</p>
      </div>
    </div>
  );
};
export default TradeInfoBox;
