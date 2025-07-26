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
          roomId,
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

    // 채팅멤버 조회
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

      console.log("isWhisper:", isWhisper);
      console.log("raw.user_id:", raw.user_id);
      console.log("내 userId:", userId);

      // 개인룸에서 내가 보낸 메시지인 경우 서버 응답 무시 (중복 방지)
      if (currentRoomId !== GLOBAL_ROOM_ID && !isWhisper) {
        // 서버에서 받은 메시지가 내가 보낸 것인지 확인
        // 방법 1: user_id로 확인 (서버에서 user_id를 제대로 보내는 경우)
        if (raw.user_id && String(raw.user_id) === String(userId)) {
          console.log("내가 보낸 메시지 서버 응답 - 무시");
          return;
        }

        // 방법 2: 서버에서 user_id가 없는 경우, 최근 메시지와 비교하여 중복 체크
        const messages = useChatStore.getState().messages;
        const recentMessage = messages
          .filter((msg) => msg.roomId === currentRoomId && String(msg.user_id) === String(userId))
          .slice(-1)[0];

        if (
          recentMessage &&
          recentMessage.content === (raw.content ?? raw.msg) &&
          Date.now() - new Date(recentMessage.createdAt).getTime() < 5000
        ) {
          // 5초 이내
          console.log("최근 메시지와 동일 - 중복으로 판단하여 무시");
          return;
        }
      }

      if (isWhisper && raw.toUserId && String(raw.toUserId) !== String(userId)) return;

      // 서버에서 정보가 누락된 경우 현재 사용자 정보로 보완
      const senderId = raw.user_id || userId;
      const senderNickName = raw.nickName || nickName;

      const message: Message = {
        id: Date.now().toString(),
        roomId: data.roomId || roomId,
        content: raw.content ?? raw.msg,
        type: "text",
        msgType: isWhisper ? "whisper" : "all",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: String(senderId),
        nickName: senderNickName,
        ...(isWhisper && {
          toUserId: raw.toUserId,
          toNickName: raw.toNickName,
        }),
      };

      addMessage(message);

      // 알림을 받았을 때
      if (isWhisper && String(raw.user_id) !== String(userId)) {
        toast.info(`${raw.nickName}님이 개인 메시지를 보냈습니다. 클릭하여 개인방으로 이동하세요.`, {
          autoClose: false,
          onClick: () => {
            // 메시지에서 받은 roomId를 우선 사용, 없으면 계산된 roomId 사용
            const privateRoomId = data.roomId || [raw.buyerId, raw.sellerId].sort().join("-");

            console.log("이동할 룸 ID:", privateRoomId);
            console.log("메시지에서 받은 roomId:", data.roomId);

            // 이미 존재하는 룸에 바로 입장 시도
            socket.emit(
              "joinRoom",
              {
                roomId: privateRoomId,
                user_id: userId,
                nickName: nickName,
              },
              (joinRes: any) => {
                if (joinRes.ok) {
                  console.log("기존 개인방 입장 성공:", privateRoomId);
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
                  // 입장 실패 시에만 룸 생성 시도
                  console.log("개인방 입장 실패, 룸 생성 시도:", joinRes.message);

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

                      // 룸 생성 후 다시 입장 시도
                      socket.emit(
                        "joinRoom",
                        {
                          roomId: privateRoomId,
                          user_id: userId,
                          nickName: nickName,
                        },
                        (retryJoinRes: any) => {
                          if (retryJoinRes.ok) {
                            console.log("룸 생성 후 입장 성공:", privateRoomId);
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
                            console.warn("룸 생성 후 입장도 실패:", retryJoinRes.message);
                            alert("채팅방 입장에 실패했습니다.");
                          }
                        }
                      );
                    }
                  );
                }
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
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId, setUserList, addMessage, router]);
};
