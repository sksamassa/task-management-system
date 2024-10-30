import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/home-top-navbar";

export const metadata: Metadata = {
  title: "Task Management System",
  description:
    "Финальаный проект Проектирования и разработки распределенных программных систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="md:max-w-6xl p-2 mx-auto">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
