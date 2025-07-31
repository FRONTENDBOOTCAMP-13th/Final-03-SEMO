import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Message, useChatStore } from "./useChatStore";
import { useUserStore } from "@/store/userStore";

export const socket = io("https://fesp-api.koyeb.app/ws/sample", { autoConnect: false });

interface UseChatSocketProps {
  userId: string;
  nickName: string;
  roomId: string;
}

export const GLOBAL_ROOM_ID = "global";

export const useChatSocket = ({ userId, nickName, roomId }: UseChatSocketProps) => {
  const { setRoomId, setUserList, addMessage } = useChatStore();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  // 개인방 입장/생성 헬퍼
  const enterRoom = (roomId: string, onSuccess?: () => void) => {
    socket.emit(
      "joinRoom",
      {
        roomId,
        user_id: userId,
        nickName,
      },
      (joinRes: any) => {
        if (joinRes.ok) {
          console.log("개인방 입장 성공:", roomId);
          setRoomId(roomId);
          onSuccess?.();
        } else {
          console.warn("입장 실패, 방 생성 후 재시도:", joinRes.message);
          socket.emit(
            "createRoom",
            {
              roomId,
              user_id: userId,
              hostName: nickName,
              roomName: roomId,
              autoClose: false,
            },
            (createRes: any) => {
              if (!createRes.ok) console.warn("방 생성 실패:", createRes.message);
              socket.emit("joinRoom", { roomId, user_id: userId, nickName }, (retryJoinRes: any) => {
                if (retryJoinRes.ok) {
                  console.log("생성 후 입장 성공:", roomId);
                  setRoomId(roomId);
                  onSuccess?.();
                } else {
                  alert("개인방 입장 실패");
                }
              });
            }
          );
        }
      }
    );
  };

  useEffect(() => {
    if (!userId || !nickName) return;
    socket.connect();

    const handleConnect = () => {
      console.log("소켓 연결:", socket.id);
      setRoomId(GLOBAL_ROOM_ID);

      socket.emit(
        "createRoom",
        {
          roomId,
          user_id: userId,
          hostName: nickName,
          roomName: "Global Room",
          autoClose: false,
        },
        () => {
          socket.emit(
            "joinRoom",
            {
              roomId: GLOBAL_ROOM_ID,
              user_id: userId,
              nickName,
            },
            (res: any) => {
              if (res.ok) {
                console.log("Global 룸 입장 성공");
              } else {
                console.warn("Global 룸 입장 실패:", res.message);
              }
            }
          );
        }
      );
    };

    const handleMembers = (memberListObj: Record<string, any>) => {
      const userList = Object.entries(memberListObj).map(([user_id, value]) => ({
        user_id,
        nickName: value.nickName,
        joinTime: value.joinTime,
      }));
      setUserList(userList);
    };

    const handleMessage = async (data: any) => {
      const currentRoomId = useChatStore.getState().currentRoomId;

      const raw =
        typeof data.msg === "object"
          ? data.msg
          : {
              msg: data.msg,
              nickName: data.nickName,
              user_id: data.user_id,
              toUserId: data.toUserId,
              toNickName: data.toNickName,
              buyerId: data.buyerId,
              sellerId: data.sellerId,
              sellerNickName: data.sellerNickName,
              postId: data.postId,
              productId: data.productId,
            };

      const isWhisper = data.msgType === "whisper";
      const isTradeDone = data.type === "tradeDone" || data.msg?.type === "tradeDone"; // 거래완료 메시지를 위해

      const messageUserId = String(raw.user_id || data.user_id || userId);
      const currentUserId = String(user?._id);
      const token = user?.token?.accessToken;

      // 거래 완료 메시지 처리
      // 거래 완료 메시지 처리
      if (isTradeDone) {
        console.log("📥 [구매자] tradeDone 메시지 수신");
        console.log("🧾 buyerId:", raw.buyerId);
        console.log("🧾 userId:", user?._id);
        console.log("🧾 token:", token);

        if (String(currentUserId) !== String(raw.buyerId)) {
          console.warn("⛔ 나는 구매자가 아님");
        } else if (!token) {
          console.warn("⛔ 토큰 없음");
        } else {
          console.log("✅ 구매자 조건 통과, orders API 호출 시작");

          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Client-Id": "febc13-final03-emjf",
              },
              body: JSON.stringify({
                products: [{ _id: Number(raw.productId), quantity: 1 }],
              }),
            });

            const result = await response.json();
            console.log("✅ [구매자] 주문 등록 결과:", result);
          } catch (err) {
            console.error("❌ [구매자] 주문 등록 실패:", err);
          }
        }

        addMessage({
          id: `${Date.now()}-${Math.random()}`,
          roomId: data.roomId || currentRoomId,
          content: raw.msg,
          type: "tradeDone",
          msgType: "all",
          createdAt: data.timestamp ?? new Date().toISOString(),
          user_id: messageUserId,
          nickName: raw.nickName || nickName,
        });

        return;
      }

      // 개인방에서 내가 보낸 메시지인 경우 무시 (중복 방지)
      if (currentRoomId !== GLOBAL_ROOM_ID && !isWhisper && messageUserId === currentUserId) {
        console.log("개인방에서 내가 보낸 메시지 서버 응답 - 무시");
        return;
      }

      // 글로벌 룸에서 로컬 플래그가 있는 메시지 무시
      if (data.local && messageUserId === currentUserId) {
        console.log("로컬 플래그 메시지 - 무시");
        return;
      }

      const message: Message = {
        id: `${Date.now()}-${Math.random()}`, // 더 고유한 ID 생성
        roomId: data.roomId || currentRoomId,
        content: raw.content ?? raw.msg,
        type: "text",
        msgType: isWhisper ? "whisper" : "all",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: messageUserId,
        nickName: raw.nickName || nickName,
        ...(isWhisper && {
          toUserId: raw.toUserId,
          toNickName: raw.toNickName,
        }),
      };

      // 중복 메시지 체크 (추가 안전망)
      const messages = useChatStore.getState().messages;
      const isDuplicate = messages.some(
        (existingMsg) =>
          existingMsg.content === message.content &&
          existingMsg.user_id === message.user_id &&
          existingMsg.roomId === message.roomId &&
          Math.abs(new Date(existingMsg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 3000 // 3초 이내
      );

      if (isDuplicate) {
        console.log("중복 메시지 감지 - 무시");
        return;
      }

      console.log("메시지 추가:", message);
      addMessage(message);

      // 알림 처리
      if (isWhisper && messageUserId !== currentUserId) {
        // if (isWhisper && String(raw.toUserId) === String(currentUserId)) {
        toast.info(`${raw.nickName}님이 개인 메시지를 보냈습니다. 클릭하여 개인방으로 이동하세요.`, {
          autoClose: false,
          onClick: () => {
            const { roomId: receivedRoomId, postId, buyerId, sellerId, sellerNickName, productId } = raw;

            if (!receivedRoomId) {
              alert("roomId 정보가 없습니다.");
              return;
            }

            enterRoom(receivedRoomId, () => {
              router.push(
                `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}&roomId=${receivedRoomId}&autojoin=true`
              );
            });
          },
        });
      }
    };

    const handleWhisper = (data: any) => {
      handleMessage({ ...data, msgType: "whisper" });
    };

    socket.on("connect", handleConnect);
    socket.on("members", handleMembers);
    socket.on("message", handleMessage);
    socket.on("sendTo", handleWhisper);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("members", handleMembers);
      socket.off("message", handleMessage);
      socket.off("sendTo", handleWhisper);
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId, setUserList, addMessage]);

  return { enterRoom };
};
