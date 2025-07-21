import { useEffect } from "react";
import { io } from "socket.io-client";
import { Message, useChatStore } from "./useChatStore";

export const socket = io("https://fesp-api.koyeb.app/ws/sample", { autoConnect: false });

interface useChatSocketProps {
  userId: string;
  nickName: string;
  roomId: string;
}

// 커스텀 훅 -> 생성(createRoom), 입장(joinRoom)
export const useChatSocket = ({ userId, nickName, roomId }: useChatSocketProps) => {
  // 현재 방 아이디를 저장하는 함수 가져옴(useChatStore), 성공 시 roomId 저장
  const setRoomId = useChatStore((state) => state.setRoomId);
  const GlOBAL_ROOM_ID = "global";

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("소켓 연결:", userId, nickName, roomId, socket.id);
      setRoomId(GlOBAL_ROOM_ID);

      socket.emit(
        "createRoom",
        {
          roomId: GlOBAL_ROOM_ID,
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
              roomId: GlOBAL_ROOM_ID,
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
    });

    socket.on("members", (memberListObj) => {
      const list = Object.entries(memberListObj).map(([user_id, value]: [string, any]) => ({
        user_id,
        nickName: value.nickName,
        joinTime: value.joinTime,
      }));
      useChatStore.getState().setUserList(list);
    });

    if (!socket) return;

    socket.off("message");
    socket.off("sendTo"); // 귓속말 이벤트도 정리

    // 모두에게 메시지 수신
    socket.on("message", (data) => {
      console.log("메시지 수신:", data);

      const raw =
        typeof data.msg === "object" ? data.msg : { msg: data.msg, nickName: data.nickName, user_id: data.user_id };

      const msg: Message = {
        id: Date.now().toString(),
        roomId: GlOBAL_ROOM_ID,
        content: raw.msg,
        type: "text",
        msgType: "all",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: raw.user_id ?? "system",
        nickName: raw.nickName ?? "시스템",
      };
      useChatStore.getState().addMessage(msg);
    });

    // 귓속말 수신 - 이벤트 리스너 수정
    socket.on("sendTo", (data) => {
      console.log("귓속말 수신:", data);

      const msg: Message = {
        id: Date.now().toString(),
        roomId: GlOBAL_ROOM_ID,
        content: data.msg, // content가 아니라 msg로 수정
        type: "text",
        msgType: "whisper",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: data.user_id,
        nickName: data.nickName,
        toUserId: data.toUserId,
        toNickName: data.toNickName,
      };
      useChatStore.getState().addMessage(msg);
    });

    return () => {
      socket.off("message");
      socket.off("sendTo"); // 정리할 때 귓속말 이벤트도 제거
      socket.emit("leaveRoom");
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId]);
};
