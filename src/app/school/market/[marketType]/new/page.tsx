import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "UniStuff | 게시글 작성",
  description: "Market 게시글 작성 페이지입니다.",
};
interface NewPageProps {
  params: Promise<{ marketType: string }>;
  // params: { marketType: string };
}

// export default function NewPage({ params }: NewPageProps) {
export default async function NewPage({ params }: NewPageProps) {
  // const { marketType } = params;
  const { marketType } = await params;
  return <RegisterForm boardType={marketType} />;
}
