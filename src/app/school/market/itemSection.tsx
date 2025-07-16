// 사고싶어요, 팔고싶어요 리스트 렌더링용 컴포넌트
'use client'
import Link from 'next/link';
import Image from 'next/image';

interface Item { id: number; title: string; img: string; }
interface Props { items: Item[]; market: 'buy' | 'sell';
}

export default function ItemSection({ items, market }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(item => (
        <Link
          key={item.id}
          href={`/school/market/${market}/${item.id}`}
          className="block rounded-lg bg-uni-gray-100 p-2"
        >
          <Image src={item.img} alt={item.title} width={150} height={150} />
          <p className="mt-2 text-16 font-medium">{item.title}</p>
          <div className="flex items-center text-16 text-uni-gray-500 mt-1">
            ❤️ <span className="ml-1">3</span>
          </div>
        </Link>
      ))}
    </div>
  );
}