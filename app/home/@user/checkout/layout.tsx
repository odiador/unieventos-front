"use client";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="w-full h-full flex items-center justify-center">
        {children}
    </div>
}
