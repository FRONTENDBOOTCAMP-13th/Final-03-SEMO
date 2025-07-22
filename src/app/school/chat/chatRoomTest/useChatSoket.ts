import { useEffect } from "react";
import { io } from "socket.io-client";
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

      const message: Message = {
        id: Date.now().toString(),
        roomId: GLOBAL_ROOM_ID,
        content: raw.msg,
        type: "text",
        msgType: isWhisper ? "whisper" : "all",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: raw.user_id ?? "system",
        nickName: raw.nickName ?? "시스템",
        ...(isWhisper && {
          toUserId: data.toUserId,
          toNickName: data.toNickName,
        }),
      };

      addMessage(message);

      // 귓속말 알림 (받는 사람이고 보낸 사람이 아닐 때)
      if (isWhisper && data.user_id !== userId) {
        console.log("귓속말 알림 표시: ", data);
        alert(`${data.nickName}님이 귓속말을 보냈습니다.`);
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
