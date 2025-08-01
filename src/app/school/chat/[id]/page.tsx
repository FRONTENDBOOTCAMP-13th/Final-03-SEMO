"use client";

import { useParams, useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";
import TradeCheck from "../components/tradeCheck";
import TradeComplete from "../components/tradeComplete";
import TradeInfoBox from "../components/tradeInfoBox";

import { socket, useChatSocket } from "../../../api/chat/useChatSoket";
import { useChatStore } from "../../../api/chat/useChatStore";
import { useUserStore } from "@/store/userStore";
import Header from "@/components/common/Header";

const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;

  const sellerId = searchParams.get("sellerId") || "";
  const productId = searchParams.get("productId") || "";
  const sellerNickName = searchParams.get("sellerNickName") || "";
  const autoJoin = searchParams.get("autojoin") === "true";
  const roomIdFromQuery = searchParams.get("roomId");

  const user = useUserStore((state) => state.user);
  const buyerId = user._id || "";
  const buyerNickName = user.name || "";

  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isTradeDone, setIsTradeDone] = useState(false);
  const [productData, setProductData] = useState<{ extra?: any } | null>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  const isSeller = String(buyerId) === String(sellerId);

  // 글로벌 방 입장
  useChatSocket({ userId: String(buyerId), nickName: buyerNickName, roomId: "global" });

  // 자동 개인방 입장(판매자입장, 채팅알림 받는 입장)
  useEffect(() => {
    if (!joinedRoom && buyerId && sellerId && autoJoin && roomIdFromQuery) {
      handleJoinRoom(roomIdFromQuery);
    }
  }, [buyerId, sellerId, joinedRoom, autoJoin, roomIdFromQuery]);

  // 방 버튼눌러서 생성 및 입장(구매자입장, 채팅시작입장에서)
  const handleJoinRoom = (targetRoomId: string) => {
    socket.emit(
      "createRoom",
      {
        roomId: targetRoomId,
        user_id: buyerId,
        hostName: buyerNickName,
        roomName: `${buyerNickName} <-> ${sellerNickName}`,
        autoClose: false,
      },
      (createRes: any) => {
        if (!createRes.ok) {
          console.warn("개인방 이미 존재:", createRes.message);
        }

        socket.emit(
          "joinRoom",
          {
            roomId: targetRoomId,
            user_id: buyerId,
            nickName: buyerNickName,
          },
          (joinRes: any) => {
            if (joinRes.ok) {
              console.log("개인방 입장 성공:", targetRoomId);
              useChatStore.getState().setRoomId(targetRoomId);
              setJoinedRoom(true);
            } else {
              console.warn("개인방 입장 실패:", joinRes.message);
            }
          }
        );
      }
    );
  };

  // 상품 정보 fetch
  useEffect(() => {
    if (productId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${productId}`, {
        headers: {
          "Client-Id": "febc13-final03-emjf",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProductData(data.item); // 여기서 저장됨
        })
        .catch((err) => console.error("상품 데이터 가져오기 실패:", err));
    }
  }, [productId]);

  useEffect(() => {
    if (productData?.extra?.crt === "거래완료") {
      setIsTradeDone(true);
    }
  }, [productData]);

  // 판매자 정보 fetch 등록된 계좌번호를 위해
  useEffect(() => {
    const token = useUserStore.getState().user?.token?.accessToken;

    if (sellerId && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": "febc13-final03-emjf",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSellerInfo(data.item);
        })
        .catch((err) => console.error("판매자 정보 요청 실패:", err));
    }
  }, [sellerId]);

  if (!id) return notFound();

  // 계좌번호 post
  const accountNumber =
    sellerInfo?.extra?.bank && sellerInfo?.extra?.bankNumber
      ? `${sellerInfo.extra.bank} ${sellerInfo.extra.bankNumber}`
      : productData?.extra?.newAccount || "계좌 정보 없음";

  const location = productData?.extra?.location || "장소 정보 없음";

  return (
    <>
      <Header title="채팅" />

      {/* 상품정보: 판매자, 상품이름, 상품사진 */}
      <ProductInfo productId={productId} />

      {/* 개인채팅 시작 버튼 */}
      <div className="px-4 my-2">
        <button
          onClick={() => {
            if (roomIdFromQuery) {
              handleJoinRoom(roomIdFromQuery);
            } else {
              alert("roomId가 없습니다. 채팅을 시작할 수 없습니다.");
            }
          }}
          className="bg-uni-blue-500 text-uni-white px-4 py-2 rounded hover:bg-uni-blue-600"
          disabled={joinedRoom}
        >
          {joinedRoom ? "개인 채팅 중..." : "1:1 채팅 시작하기"}
        </button>
      </div>

      {/* 채팅내역 */}
      <ChatBubbleList />

      {/* 거래완료버튼: 판매자에게만 뜨도록 */}
      {!isTradeDone && (
        <TradeCheck
          postId={productId}
          isSeller={isSeller}
          onComplete={() => setIsTradeDone(true)}
          productExtra={productData?.extra || {}}
        />
      )}

      {/* 거래완료버튼: 구매자에게 뜨도록(ㅇㅇㅇ님의 참여가 승인되었습니다.)  */}
      {isTradeDone && !isSeller && <TradeComplete buyerName={buyerNickName} />}

      {/* 거래완료되면 계좌번호, 거래장소 */}
      {isTradeDone && <TradeInfoBox location={location} accountNumber={accountNumber} />}

      {/* 채팅 인풋창*/}
      <InputChat userId={buyerId} nickName={buyerNickName} sellerId={sellerId} sellerNickName={sellerNickName} />
    </>
  );
};

export default ChatPage;
