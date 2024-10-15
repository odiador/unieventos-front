import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AmaEvents | Register",
  description: "lol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <form className="gap-2 flex flex-col min-w-96">{children}</form>
  );
}
