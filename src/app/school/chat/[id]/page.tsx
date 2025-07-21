import { notFound } from "next/navigation";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { id } = await params;
  if (!id) return notFound();

  return (
    <main className="p-4">
      <h1 className="text-16 font-bold mdb-4">채팅방 #{id}</h1>
      {/* 여기에 채팅 UI 또는 컴포넌트 불러오기 */}
      <p>여기서 채팅 내용을 불러와서 보여줄 수 있습니다.</p>
    </main>
  );
};

export default ChatPage;
