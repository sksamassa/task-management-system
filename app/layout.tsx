import type { Metadata } from "next";
import "./globals.css";

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
        <main>{children}</main>
      </body>
    </html>
  );
}
