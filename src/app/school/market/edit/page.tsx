'use client';
import { useState } from 'react';

export default function EditPage() {
  const [selected, setSelected] = useState('registered');
  return (
    <>
      <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
      <input 
        type="text"
        placeholder='상품명'
        className='w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16'  
      />
      <input 
        type="text"
        placeholder='사진 추가'
        className='w-full bg-uni-gray-200 rounded-md p-3 mb-5 text-16'  
      />
      <div className="flex gap-3 mb-5">
        <button className="px-4 py-2 rounded-lg bg-yellow-100 text-black font-semibold text-sm">팔래요</button>
        <button className="px-4 py-2 rounded-lg bg-uni-red-200 text-black font-semibold text-sm">살래요</button>
        <button className="px-4 py-2 rounded-lg bg-uni-blue-200 text-black font-semibold text-sm">모여요</button>
      </div>
      {/* 카테고리 셀렉트 */}
      <select className='w-full bg-uni-gray-200 rounded-lg p-3 text-16 text-uni-gray-600'>
        <option value="">카테고리</option>
        <option value="음식">음식</option>
        <option value="서적">서적</option>
        <option value="생활용품">생활용품</option>
        <option value="학용품">학용품</option>
      </select>
      <textarea 
        placeholder='상품 설명'
        className='w-full h-[150px] bg-uni-gray-200 rounded-md p-3 mb-8 mt-8 text-16'  
        maxLength={250}
      />
      <input 
        type="text"
        placeholder='가격'
        className='w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16'  
      />
      <input 
        type="text"
        placeholder='거래 장소'
        className='w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16'  
      />

      {/* 라디오 버튼 */}
      <label className={`flex justify-between items-center p-3 mb-3 rounded-lg border ${selected === 'registered' ? 'border-uni-blue-500' : 'border-uni-gray-200'}`}>
        <span className="ml-2 text-sm font-medium">등록된 계좌 번호</span>
        <input
          type="radio"
          name="account"
          value="registered"
          checked={selected === 'registered'}
          onChange={() => setSelected('registered')}
          className=""
        />

      </label>

      <label className={`flex justify-between items-center p-3 mt-3 mb-8 rounded-lg border ${selected === 'new' ? 'border-uni-blue-500' : 'border-uni-gray-200'}`}>
        <span className="ml-2 text-sm font-medium">새로운 계좌 번호</span>
        <input
          type="radio"
          name="account"
          value="new"
          checked={selected === 'new'}
          onChange={() => setSelected('new')}
          className=""
        />
      </label>
      </div>
    </>
  );
}