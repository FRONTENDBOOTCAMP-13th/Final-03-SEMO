import UserProfileContainer from "./_components/UserProfileContainer";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <UserProfileContainer userId={params.id} />;
}
