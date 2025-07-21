import { notFound, useSearchParams } from "next/navigation";
import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { id } = await params;
  if (!id) return notFound();
  const searchParams = useSearchParams();

  const buyerId = searchParams.get("buyerId") || "";
  const sellerId = searchParams.get("sellerId") || "";
  const productId = searchParams.get("productId") || "";

  return (
    <>
      <ProductInfo />
      <ChatBubbleList myUserId={buyerId} />
      <InputChat userId={userId} />
    </>
  );
};

export default ChatPage;
