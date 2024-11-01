import { auth } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import Logout from "./log-out";
import { Button } from "./ui/button";

export default async function Navbar() {
  const session = await auth();
  return (
    <header className="p-2 px-4 bg-green-500 text-white mb-6">
      <nav className="p-4 px-10 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-x-6 font-semibold">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        <div>
          {session?.user?.id ? (
            <Logout />
          ) : (
            <div className="space-x-4">
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
