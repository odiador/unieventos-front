import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AmaEvents | Login",
  description: "lol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-screen relative flex min-h-screen items-center justify-center">
      <div className="relative bg-[#292e34] gap-3 flex flex-col py-8 px-5 rounded-md border-2 border-white/5">
        <div className="shadow" />
        {children}
      </div>
    </main>
  );
}
