import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductInfoProps {
  productId: string;
  sellerId: string;
}

const ProductInfo = ({ productId, sellerId }: ProductInfoProps) => {
  const [product, setProduct] = useState<{
    title: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
        const json = await res.json();
        if (json.ok) {
          setProduct(json.item);
        }
      } catch (err) {
        console.error("상품 정보 로딩 실패", err);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <Image
        src={"/assets/defaultImg.png"}
        alt="상품 이미지"
        width={56}
        height={56}
        className="rounded-md object-cover"
      />
      <div className="flex flex-col">
        <p className="text-16 font-semibold text-uni-black">판매자: {sellerId}</p>
        <p className="text-14 text-uni-gray-600">거래 물품: {product?.title || "정보 없음"}</p>
      </div>
    </div>
  );
};
export default ProductInfo;
