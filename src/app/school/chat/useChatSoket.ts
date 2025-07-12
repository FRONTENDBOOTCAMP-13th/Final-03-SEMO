import { useEffect } from "react";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

export const socket = io("https://fesp-api.koyeb.app/websocket/sample");

interface useChatSocketProps {
  userId: string;
  nickName: string;
  roomName: string;
}

// 커스텀 훅 -> 생성(createRoom), 입장(joinRoom)
export const useChatSocket = ({ userId, nickName, roomName }: useChatSocketProps) => {
  // 현재 방 아이디를 저장하는 함수 가져옴(useChatStore), 성공 시 roomId 저장
  const setRoomId = useChatStore((state) => state.setRoomId);
  useEffect(() => {
    // createRoom 먼저 요청
    socket.emit(
      "createRoom",
      {
        user_id: userId,
        hostName: nickName,
        roomName,
      },
      (res: any) => {
        // 방 생성 성공
        if (res.ok) {
          // 같은 roomId로 입장 요청
          const roomId = res.roomInfo.roomId;
          setRoomId(roomId);
          socket.emit(
            "joinRoom",
            {
              roomId,
              user_id: userId,
              nickName,
            },
            (joinRes: any) => {
              if (joinRes.ok) {
                console.log("채팅방 입장 완료");
              }
            }
          );
        } else {
          console.error("방 생성 실패:", res.message);
        }
      }
    );
    // 메시지 이벤트 수신
    socket.on("message", (data) => {
      console.log("메시지 수신:", data);
    });
    // 페이지 이동하거나 컴포넌트 사라질 때 연결 종료
    return () => {
      socket.disconnect();
    };
  }, [userId, nickName, roomName, setRoomId]);
};
