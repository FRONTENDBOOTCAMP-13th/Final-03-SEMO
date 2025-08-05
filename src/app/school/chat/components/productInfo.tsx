import Image from "next/image";

interface ProductInfoProps {
  productData?: {
    title: string;
    image: string;
    user: {
      name: string;
    };
  };
}

const ProductInfo = ({ productData }: ProductInfoProps) => {
  const fullImageUrl = productData?.image || "/assets/defaultImg.png";

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <Image src={fullImageUrl} alt="거래 물품" width={56} height={56} className="rounded-md object-cover" />
      <div className="flex flex-col">
        <p className="text-16 font-semibold text-uni-black">판매자: {productData?.user?.name || "정보 없음"}</p>
        <p className="text-14 text-uni-gray-600">거래 물품: {productData?.title || "정보 없음"}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
