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
    <>{children}</>
  );
}
