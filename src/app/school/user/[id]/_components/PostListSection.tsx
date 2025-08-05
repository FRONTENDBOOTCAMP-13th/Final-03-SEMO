import { Post } from '@/types';
import UserPostList from './UserPostList';

async function PostListSection({ userPostsPromise }: { userPostsPromise: Promise<{ sell: Post[]; buy: Post[]; groupPurchase: Post[] }> }) {
  const { sell, buy, groupPurchase } = await userPostsPromise;

  return (
    <UserPostList
      sellPosts={sell}
      buyPosts={buy}
      groupPurchasePosts={groupPurchase}
    />
  );
}

export default PostListSection;