import PostContent from "./_components/PostContent";

interface PageProps {
  params: Promise<{ marketType: string; postId: string }>;
}

export default async function MarketDetailPage({ params }: PageProps) {
  const { postId } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    headers: {
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
    },
    cache: "no-store",
  });
  const json = await res.json();
  return <PostContent post={json.item} />;
}
