import UserProfilePageClient from "./_components/UserProfilePageClient";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <UserProfilePageClient userId={params.id} />;
}
