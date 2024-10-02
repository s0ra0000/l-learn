"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  if (!isAuthenticated && !isLoading) {
    router.push("/auth");
  }
  return (
    <div className="flex h-full flex-wrap">
      <Sidebar />
      <main className="flex flex-col flex-1 h-full">
        <Header />
        {children}
        <Footer />
      </main>
    </div>
  );
}
