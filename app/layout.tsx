import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmaEvents",
  description: "Amaevents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} flex flex-col`}  >
        <div className="fixed -z-50 bg-[#1d2228] pointer-events-none left-0 top-0 w-screen h-screen" />
        {children}
        <div className="fixed bottom-0 w-full text-white/10 h-10 justify-center flex items-center text-center">
          <Link href={"https://github.com/odiador"} className="hover:scale-105 transition-all hover:text-white/100 cursor-pointer h-full px-4 content-center">Made with ❤️ by <strong>Amador</strong></Link>
        </div>
      </body>
    </html>
  );
}
