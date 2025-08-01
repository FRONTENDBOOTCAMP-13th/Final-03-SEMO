import PostContent from "./_components/PostContent";
import MarketPageHeader from "@/app/school/market/_components/MarketPageHeader";

interface PageProps {
  params: Promise<{ marketType: string; postId: string }>;
}

/**
 * 상품 상세 페이지 user flow
 * 1. 유저가 market페이지에서 상품을 클릭하면 상세 페이지로 이동
 * 2. [postId]/page.tsx를 통해 해당 상품의 상세 정보를 API에게 요청해서 가져옴
 * 3. 서버가 상품 상세 정보를 가져온다, function/post.ts의 getPost 함수
 * 4. postConent 컴포넌트를 통해 해당 상품 상세 정보 페이지를 렌더링한다.
 */

export default async function MarketDetailPage({ params }: PageProps) {
  const { postId } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    headers: {
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
    },
    cache: "no-store",
  });
  const json = await res.json();
  return (
    <>
      <MarketPageHeader />
      {/* <PostContent post={json.item} marketType={json.item.type} /> */}
      <PostContent post={json.item} marketType={json.item?.type || "buy"} />
    </>
  );
}
