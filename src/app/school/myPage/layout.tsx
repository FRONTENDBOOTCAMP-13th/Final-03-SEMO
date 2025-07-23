import MyPageHeader from "./_components/MyPageHeader";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MyPageHeader />
      {children}
    </>
  );
}
