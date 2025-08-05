import UserProfileContainer from "./_components/UserProfileContainer";

export default async function UserProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return <UserProfileContainer userId={id} />;
}
