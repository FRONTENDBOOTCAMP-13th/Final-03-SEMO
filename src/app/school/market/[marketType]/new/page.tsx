import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "UniStuff | 게시글 작성",
  description: "Market 게시글 작성 페이지입니다.",
};
interface NewPageProps {
  params: { marketType: string };
}

export default function NewPage({ params }: NewPageProps) {
  const { marketType } = params;
  return <RegisterForm boardType={marketType} />;
}
