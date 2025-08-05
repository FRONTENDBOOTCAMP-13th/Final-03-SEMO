import PostForm from "@/app/school/market/_components/_PostComponents/PostForm";
import MarketPageHeader from "../../_components/MarketPageHeader";

export default async function NewPage() {
  return (
    <>
      <MarketPageHeader />
      <PostForm mode="create" marketType="groupPurchase" />
    </>
  );
}
