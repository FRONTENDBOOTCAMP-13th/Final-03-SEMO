import RegisterForm from "./RegisterForm";

interface NewPageProps {
  params: { marketType: string };
}

export default function NewPage({ params }: NewPageProps) {
  const { marketType } = params;
  return <RegisterForm boardType={marketType} />;
}
