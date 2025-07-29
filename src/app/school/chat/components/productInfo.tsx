import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductInfoProps {
  productId: string;
}

const ProductInfo = ({ productId }: ProductInfoProps) => {
  const [product, setProduct] = useState<{
    title: string;
    image: string;
    user: {
      name: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${productId}`;
        console.log("요청 URL:", url);

        const res = await fetch(url, {
          headers: {
            "Client-Id": "febc13-final03-emjf",
          },
        });
        const json = await res.json();

        console.log("product API 응답 결과:", json);

        if (json.ok && json.item) {
          setProduct(json.item);
        } else {
          console.warn("상품 데이터가 비어있습니다.");
        }
      } catch (err) {
        console.error("상품 정보 로딩 실패", err);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const fullImageUrl = product?.image
    ? `${process.env.NEXT_PUBLIC_API_URL}/${product.image}`
    : "/assets/defaultImg.png";

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <Image src={fullImageUrl} alt="판매자 이미지" width={56} height={56} className="rounded-md object-cover" />
      <div className="flex flex-col">
        <p className="text-16 font-semibold text-uni-black">판매자: {product?.user?.name || "정보 없음"}</p>
        <p className="text-14 text-uni-gray-600">거래 물품: {product?.title || "정보 없음"}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
