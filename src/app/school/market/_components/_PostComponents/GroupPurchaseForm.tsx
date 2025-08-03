import { Post } from "@/types";

interface GroupPurchaseProps {
  initialData?: Post; // 수정 모드에서 기존 데이터 받기
}

// 공동구매 추가 Form 컴포넌트
export default function GroupPurchase({ initialData }: GroupPurchaseProps) {
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
            defaultValue={initialData?.extra?.participants || ""}
            className="w-full bg-uni-gray-100 rounded-lg p-4 text-16"
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
          defaultValue={initialData?.extra?.groupLocation || ""}
          className="w-full h-12 bg-uni-gray-100 rounded-lg p-4 text-16"
        />
        <p className="text-14 text-uni-gray-600 mt-2">분배할 장소를 입력해주세요</p>
      </div>
      <div className="mb-8">
        <label htmlFor="deadline" className="sr-only">
          마감시간
        </label>
        <div className="relative">
          <input
            id="deadLine"
            name="deadLine"
            type="datetime-local"
            data-placeholder="마감시간"
            defaultValue={
              initialData?.extra?.deadLine ? new Date(initialData.extra.deadLine).toISOString().slice(0, 16) : ""
            }
            className="w-1.5/3 h-12 bg-uni-gray-200 rounded-lg p-3 text-16"
          />
          <p className="text-14 text-uni-gray-600 mt-2">마감시간을 설정해주세요</p>
        </div>
      </div>
    </section>
  );
}
