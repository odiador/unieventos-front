"use client";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="relative w-full h-full flex items-center justify-center py-16 px-4">
            <div className="relative bg-[#292e34] w-full md:w-2/3 gap-3 flex flex-col min-w-80 py-8 px-5 rounded-md border-2 border-white/5">
                <div className="shadow" />
                {children}
            </div>
        </main>
    );
}