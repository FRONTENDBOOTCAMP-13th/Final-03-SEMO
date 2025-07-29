import PostForm from "@/app/school/market/_components/_PostComponents/PostForm";
import MarketPageHeader from "../../_components/MarketPageHeader";

// interface NewPageProps {
//   params: Promise<{ marketType: string }>;
// }

export default async function NewPage() {
  return (
    <>
      <MarketPageHeader />
      <PostForm mode="create" marketType="groupPurchase" />
    </>
  );
}
