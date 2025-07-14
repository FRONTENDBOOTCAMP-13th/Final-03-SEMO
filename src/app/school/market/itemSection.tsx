// 사고싶어요, 팔고싶어요 리스트 렌더링용 컴포넌트
import Image from 'next/image';

interface Item {
  id: number;
  title: string;
  img: string;
}

interface Props {
  title: string;
  items: Item[];
}

export default function ItemSection({ title, items }: Props) {
  return (
    <div>
      <h2 className="text-base font-bold text-18 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div>
            <div
              key={item.id}
              className="rounded-lg p-2 bg-uni-gray-100"
            >
              <Image
                src={item.img}
                alt='img'
                width={150}
                height={150}
                className="rounded-md w-full h-auto"
              />
            </div>
            <p className="text-sm mt-2 text-16">{item.title}</p>
            <div className="flex items-center text-16 text-uni-gray-500 mt-1">
              ❤️ <span className="ml-1 mr-2">3</span> 💬 <span className="ml-1">5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}