import { Suspense } from "react";
import type { Metadata } from "next";
import UserProfileContainer from "./_components/UserProfileContainer";
import PostListSection from "./_components/PostListSection";
import ReviewListSection from "./_components/ReviewListSection";
import { getSellerReviews } from "@/data/functions/sellerReviews";
import { Post } from "@/types";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: { "Client-Id": CLIENT_ID },
    });
    const data = await res.json();
    const user = data.item;
    if (!user) return { title: "사용자 정보 없음 | SEMO" };
    return {
      title: `${user.name}님의 프로필`,
      description: `${user.name}님의 판매 상품, 거래 후기 등 프로필 정보를 확인하세요.`,
    };
  } catch {
    return { title: "프로필 | SEMO", description: "사용자 프로필 정보를 확인하세요." };
  }
}

async function getUserInfo(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
    headers: { "Client-Id": CLIENT_ID },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return (await res.json()).item;
}

async function getUserPosts(userId: string) {
  const postTypes = ["sell", "buy", "groupPurchase"];
  const results: { sell: Post[]; buy: Post[]; groupPurchase: Post[] } = { sell: [], buy: [], groupPurchase: [] };
  try {
    const responses = await Promise.all(
      postTypes.map((type) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=${type}`, {
          headers: { "Client-Id": CLIENT_ID },
          next: { revalidate: 60 },
        })
      )
    );
    const data = await Promise.all(responses.map((res) => res.json()));
    data.forEach((result, index) => {
      if (result.ok && result.item) results[postTypes[index] as keyof typeof results] = result.item;
    });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
  }
  return results;
}

async function getUserReviews(userId: string) {
  try {
    const reviewsResponse = await getSellerReviews(userId);
    if (reviewsResponse.ok && reviewsResponse.item) return reviewsResponse.item;
  } catch (error) {
    console.error("Failed to fetch user reviews:", error);
  }
  return [];
}

function SectionSkeleton() {
  return <div className="h-40 bg-gray-200 rounded-md animate-pulse"></div>;
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const userInfoPromise = getUserInfo(userId);
  const userPostsPromise = getUserPosts(userId);
  const userReviewsPromise = getUserReviews(userId);

  return (
    <main>
      <h1 className="sr-only">사용자 프로필</h1>
      <UserProfileContainer userId={userId} userInfoPromise={userInfoPromise} userPostsPromise={userPostsPromise} />
      <div className="p-4 space-y-6">
        <Suspense fallback={<SectionSkeleton />}>
          <PostListSection userPostsPromise={userPostsPromise} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ReviewListSection userReviewsPromise={userReviewsPromise} />
        </Suspense>
      </div>
    </main>
  );
}
