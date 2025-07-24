import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Message, useChatStore } from "./useChatStore";
export const socket = io("https://fesp-api.koyeb.app/ws/sample", { autoConnect: false });

interface UseChatSocketProps {
  userId: string;
  nickName: string;
  roomId: string;
}

const GLOBAL_ROOM_ID = "global";

export const useChatSocket = ({ userId, nickName, roomId }: UseChatSocketProps) => {
  const { setRoomId, setUserList, addMessage } = useChatStore();

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("소켓 연결:", userId, nickName, socket.id);
      setRoomId(GLOBAL_ROOM_ID);

      // 방 생성 후 입장
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
            };

      // 귓속말 여부 확인
      const isWhisper = data.msgType === "whisper";

      if (String(data.user_id) === String(userId && isWhisper)) {
        return;
      }

      const senderId = raw.user_id || data.user_id || userId;

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
          toUserId: String(data.toUserId),
          toNickName: data.toNickName,
        }),
      };

      addMessage(message);
      console.log("귓속말 수신 전체 데이터 확인:", data);

      if (isWhisper && String(data.user_id) !== String(userId)) {
        const privateRoomId = [data.user_id, data.toUserId].sort().join("-");
        const handleJoinPrivateRoom = () => {
          socket.emit(
            "createRoom",
            {
              roomId: privateRoomId,
              user_id: userId,
              hostName: nickName,
              roomName: `${data.user_id} <-> ${data.toUserId}`,
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
                    console.log(`[WebSocket] "${userId}"님이 "${privateRoomId}"에 참여했습니다.`);
                    useChatStore.getState().setRoomId(privateRoomId);
                  } else {
                    console.warn("자동 입장 실패:", joinRes.message);
                  }
                }
              );
            }
          );
        };
        toast.info(`${data.nickName}님이 개인 메시지를 보냈습니다. 클릭하여 개인방으로 이동하세요.`, {
          autoClose: false,
          onClick: () => handleJoinPrivateRoom(),
        });
      }
    };

    const handleWhisper = (data: any) => {
      console.log("귓속말 수신:", data);
      // sendTo 이벤트로 온 메시지도 동일하게 처리
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
      socket.emit("leaveRoom");
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId, setUserList, addMessage]);
};
