import Image from "next/image";

const ProductInfo = () => {
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
        <p className="text-16 font-semibold text-uni-black">10,000,000원</p>
        <p className="text-14 text-uni-gray-600">거래 물품: ???</p>
      </div>
    </div>
  );
};
export default ProductInfo;
