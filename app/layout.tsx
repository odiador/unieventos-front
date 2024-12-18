import { AuthProvider } from "@/api/utils/auth";
import Header from "@/components/header";
import { ModalProvider } from "@/components/modal";
import MadeBy from "@/components/watermark";
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
      <body className={`${inter.className}`}  >
        <AuthProvider>
          <ModalProvider>
            <div className="flex flex-col max-h-screen h-screen gap-1">
              <Header />
              <div className="fixed -z-50 bg-[#1d2228] pointer-events-none left-0 top-0 w-screen h-screen" />
              <div className="grow">{children}</div>
              <MadeBy />
            </div>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
