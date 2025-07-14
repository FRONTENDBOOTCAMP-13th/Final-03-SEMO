"use client";

// 아이템 공통 타입
export interface Item {
  id: number;
  title: string;
  price: string;
  image: string;
  status: "판매중" | "판매완료";
}

export default function ItemCard({ item }: { item: Item }) {
  const getStatusButton = (status: Item["status"]) => {
    if (status === "판매중") {
      return <button className="px-4 py-2 bg-green-400 text-white text-sm rounded-lg font-medium ml-4">판매중</button>;
    } else {
      return <button className="px-4 py-2 bg-gray-400 text-white text-sm rounded-lg font-medium ml-4">판매완료</button>;
    }
  };

  return (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          {item.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden">
            <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.title}</h3>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{item.price}</p>
        </div>
      </div>
      {getStatusButton(item.status)}
    </div>
  );
}
