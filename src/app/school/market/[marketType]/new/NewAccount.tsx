// 새로운 계좌 입력 컴포넌트
export default function NewAccount() {
  return (
    <div>
      <select className="w-full bg-uni-gray-200 rounded-lg p-3 mb-5 text-16 text-uni-gray-600">
        <option value="">은행사</option>
        <option value="카카오뱅크">카카오뱅크</option>
        <option value="우리은행">우리은행</option>
        <option value="농협">농협</option>
        <option value="기업은행">기업은행</option>
      </select>
      <input type="text" placeholder="계좌번호" className="w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16" />
    </div>
  );
}
