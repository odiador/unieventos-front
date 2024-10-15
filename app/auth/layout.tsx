"use client";

import { ModalProvider } from "@/components/modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModalProvider>
      <main className="relative h-full flex items-center justify-center">
        <div className="relative bg-[#292e34] max-w-96 gap-3 flex flex-col min-w-80 py-8 px-5 rounded-md border-2 border-white/5">
          <div className="shadow" />
          {children}
        </div>
      </main>
    </ModalProvider>
  );
}
