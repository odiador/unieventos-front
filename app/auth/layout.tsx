"use client";

import { useAuthContext } from "@/api/utils/auth";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense><AuthLayout>{children}</AuthLayout></Suspense>
}

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { loggedIn } = useAuthContext();
  useEffect(() => {
    if (loggedIn()) router.push("/");
  }, [])
  return (

    <main className="relative w-full h-full flex items-center justify-center py-16 px-4">
      <div className="relative bg-[#292e34] w-full md:w-2/3 xl:w-[768px] gap-3 flex flex-col min-w-80 py-8 px-5 rounded-md border-2 border-white/5">
        <div className="shadow" />
        {children}
      </div>
    </main >
  );
}
