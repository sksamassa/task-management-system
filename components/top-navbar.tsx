import { auth } from "@/lib/auth";
import Link from "next/link";
import Logout from "./log-out";

export default async function TopNavbar() {
  const session = await auth();
  return (
    <div className="p-2 px-4 bg-green-500 text-white">
      <nav className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-x-6 font-semibold">
          <Link href="/my-account">My Account</Link>
          <Link href="/change-password">Change Password</Link>
        </div>
        <div>{session?.user?.id && <Logout />}</div>
      </nav>
    </div>
  );
}
