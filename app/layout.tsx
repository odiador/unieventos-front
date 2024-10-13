import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}  >
        <div className="fixed -z-50 bg-[#1d2228] pointer-events-none left-0 top-0 w-screen h-screen"></div>
        {children}
      </body>
    </html>
  );
}
