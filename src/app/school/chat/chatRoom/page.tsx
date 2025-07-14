import ChatBubble from "../components/chatBubble/page";
import InputChat from "../components/inputChat/page";
import ProductInfo from "../components/productInfo/page";
import TradeInfoBox from "../components/tradeInfoBox/page";

const ChatRoom = () => {
  return (
    <>
      <ProductInfo />
      <ChatBubble />
      <ChatBubble />
      <TradeInfoBox />
      <InputChat />
    </>
  );
};
export default ChatRoom;
