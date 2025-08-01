import { ChevronsUpDown } from "lucide-react";

// 새로운 계좌 입력 컴포넌트
export default function NewAccount() {
  return (
    <div className="relative">
      <select className="w-full h-14 bg-uni-gray-200 rounded-lg p-3 mb-5 text-16 text-uni-gray-600 appearance-none">
        <option value="">은행사</option>
        <option value="카카오뱅크">카카오뱅크</option>
        <option value="우리은행">우리은행</option>
        <option value="농협">농협</option>
        <option value="기업은행">기업은행</option>
      </select>
      <div className="absolute right-3 top-1/5 -translate-y-1/2 pointer-events-none">
        <ChevronsUpDown size={25} className="text-uni-gray-600" />
      </div>
      <input
        type="text"
        placeholder="계좌번호 ('-' 제외하고 숫자만 입력)"
        className="w-full bg-uni-gray-100 rounded-lg p-4 text-16"
      />
    </div>
  );
}
