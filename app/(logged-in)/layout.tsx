import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TopNavbar from "@/components/top-navbar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <TopNavbar />
          <div className="flex-1 flex justify-center items-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
