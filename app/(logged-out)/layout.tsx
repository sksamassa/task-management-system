import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex justify-center items-center">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
