// 공동구매 추가 Form 컴포넌트
export default function GroupPurchase() {
  return (
    <section className="mb-8">
      <div className="mb-5">
        <label htmlFor="participants" className="sr-only">
          인원수
        </label>
        <div className="relative">
          <input
            type="participants"
            name="participants"
            placeholder="인원"
            className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
            min="1"
          />
          <p className="text-14 text-uni-gray-600 mt-2">총금액을 나눠서 결제할 인원수를 입력해주세요</p>
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="groupLocation" className="sr-only">
          분배 장소
        </label>
        <input
          type="text"
          id="groupLocation"
          name="groupLocation"
          placeholder="분배 장소"
          className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
        />
        <p className="text-14 text-uni-gray-600 mt-2">분배할 장소를 입력해주세요</p>
      </div>
      <div className="mb-8">
        <label htmlFor="deadline" className="sr-only">
          마감시간
        </label>
        <div className="relaltive">
          <input
            id="deadline"
            name="deadline"
            type="datetime-local"
            className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
          />
          <p className="text-14 text-uni-gray-600 mt-2">마감시간을 설정해주세요</p>
        </div>
      </div>
    </section>
  );
}
