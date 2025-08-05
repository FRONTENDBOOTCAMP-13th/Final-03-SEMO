import UserProfileContainer from "./_components/UserProfileContainer";

// export default function UserProfilePage({ params }: { params: { id: string } }) {
//   return <UserProfileContainer userId={params.id} />;
// }

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileContainer userId={id} />;
}
