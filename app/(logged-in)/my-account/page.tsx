import { auth } from "@/lib/auth";

export default async function MyAccountPage() {
  const session = await auth();
  let user;

  if (session?.user?.id) {
    user = session?.user;
  }

  return (
    <div>
      <div>
        <h3>E-mail: {user?.email}</h3>
      </div>
      <div>List of tasks</div>
    </div>
  );
}
