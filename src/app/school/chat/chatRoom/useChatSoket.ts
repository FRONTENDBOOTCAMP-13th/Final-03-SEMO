import { useEffect } from "react";
import { io } from "socket.io-client";
import { Message, useChatStore } from "./useChatStore";

export const socket = io("https://fesp-api.koyeb.app/ws/sample");

interface useChatSocketProps {
  userId: string;
  nickName: string;
  roomId: string;
}

// 커스텀 훅 -> 생성(createRoom), 입장(joinRoom)
export const useChatSocket = ({ userId, nickName, roomId }: useChatSocketProps) => {
  // 현재 방 아이디를 저장하는 함수 가져옴(useChatStore), 성공 시 roomId 저장
  const setRoomId = useChatStore((state) => state.setRoomId);
  useEffect(() => {
    console.log("[소켓 진입] userId:", userId, "| nickName:", nickName, "| room:", roomId);

    socket.emit(
      "createRoom",
      {
        roomId,
        user_id: userId,
        hostName: nickName,
        roomName: roomId,
      },
      (res: any) => {
        if (res.ok) {
          // ✅ 방 새로 생성되었을 때
          const roomId = res.roomInfo.roomId;
          console.log("✅ 방 생성 성공:", roomId);
          setRoomId(roomId);

          socket.emit(
            "joinRoom",
            {
              roomId,
              user_id: userId,
              nickName,
            },
            (res: any) => {
              if (res.ok) {
                console.log("✅ 방 입장 성공");
              } else {
                console.warn("❌ 방 입장 실패", res.message);
              }
            }
          );
        } else {
          // ✅ 방이 이미 존재하는 경우 → joinRoom만 진행
          if (res.message?.includes("이미 존재하는 roomId")) {
            console.warn("⚠️ 이미 방이 존재합니다. joinRoom만 수행합니다.");

            setRoomId(roomId); // 수동으로 저장해줌

            socket.emit(
              "joinRoom",
              {
                roomId,
                user_id: userId,
                nickName,
              },
              (res: any) => {
                if (res.ok) {
                  console.log("✅ 방 입장 성공 (기존 방)");
                } else {
                  console.warn("❌ 방 입장 실패", res.message);
                }
              }
            );
          } else {
            console.warn("❌ 방 생성 실패:", res.message);
          }
        }
      }
    );

    socket.on("message", (data) => {
      console.log("메시지 수신:", data);
      const raw = typeof data.msg === "object" ? data.msg : { msg: data.msg };

      const msg: Message = {
        id: Date.now().toString(),
        roomId: raw.roomId ?? roomId,
        content: raw.msg,
        type: "text",
        createdAt: data.timestamp ?? new Date().toISOString(),
        user_id: raw.user_id,
        nickName: raw.nickName,
      };
      useChatStore.getState().addMessage(msg);
    });

    return () => {
      socket.emit("leaveRoom");
      socket.disconnect();
    };
  }, [userId, nickName, roomId, setRoomId]);
};
