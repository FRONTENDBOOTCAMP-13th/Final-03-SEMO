import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Message, useChatStore } from "./useChatStore";

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

  useEffect(() => {
    if (!userId || !nickName) return;

    socket.connect();

    const handleConnect = () => {
      console.log("소켓 연결:", userId, nickName, socket.id);
      setRoomId(GLOBAL_ROOM_ID);

      socket.emit(
        "createRoom",
        {
          roomId: GLOBAL_ROOM_ID,
          user_id: userId,
          hostName: nickName,
          roomName: "Global Room",
          autoClose: false,
        },
        (res: any) => {
          if (!res.ok) {
            console.warn("Global 룸 이미 존재:", res.message);
          }

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
                console.warn("방 입장 실패", res.message);
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

    const handleMessage = (data: any) => {
      console.log("메시지 수신:", data);

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

      console.log("isWhisper:", isWhisper);
      console.log("raw.user_id:", raw.user_id);
      console.log("내 userId:", userId);

      // if (isWhisper && data.user_id === String(userId)) return;
      if (isWhisper && raw.toUserId && String(raw.toUserId) !== String(userId)) return;

      // if (isWhisper && String(data.user_id) === String(userId)) return;

      const senderId = raw.user_id || userId;

      const message: Message = {
        id: Date.now().toString(),
        roomId: GLOBAL_ROOM_ID,
        content: raw.msg,
        type: "text",
        msgType: isWhisper ? "whisper" : "all",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: String(senderId),
        nickName: raw.nickName ?? "시스템",
        ...(isWhisper && {
          toUserId: raw.toUserId,
          toNickName: raw.toNickName,
        }),
      };

      addMessage(message);

      if (isWhisper && String(raw.user_id) !== String(userId)) {
        toast.info(`${raw.nickName}님이 개인 메시지를 보냈습니다. 클릭하여 개인방으로 이동하세요.`, {
          autoClose: false,
          onClick: () => {
            const privateRoomId = [raw.buyerId, raw.sellerId].sort().join("-");

            socket.emit(
              "createRoom",
              {
                roomId: privateRoomId,
                user_id: userId,
                hostName: nickName,
                roomName: `${raw.buyerId} <-> ${raw.sellerId}`,
                autoClose: false,
              },
              (createRes: any) => {
                if (!createRes.ok) {
                  console.warn("개인방 이미 존재:", createRes.message);
                }

                socket.emit(
                  "joinRoom",
                  {
                    roomId: privateRoomId,
                    user_id: userId,
                    nickName: nickName,
                  },
                  (joinRes: any) => {
                    if (joinRes.ok) {
                      useChatStore.getState().setRoomId(privateRoomId);

                      const { postId, buyerId, sellerId, sellerNickName, productId } = raw;
                      if (postId && buyerId && sellerId && sellerNickName && productId) {
                        router.push(
                          `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}`
                        );
                      } else {
                        alert("채팅 이동 정보가 부족합니다.");
                      }
                    } else {
                      console.warn("자동 입장 실패:", joinRes.message);
                    }
                  }
                );
              }
            );
          },
        });
      }
    };

    const handleWhisper = (data: any) => {
      console.log("귓속말 수신:", data);
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
      // socket.emit("leaveRoom");
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId, setUserList, addMessage, router]);
};
