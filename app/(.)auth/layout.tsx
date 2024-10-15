"use client";
import { ModalProvider } from "@/components/modal";
import { motion } from "framer-motion";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ModalLayout>{children}</ModalLayout>
    );
}

export function ModalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ModalProvider>
        <div className="absolute flex items-center justify-center flex-col gap-2 top-0 left-0 z-10 w-full h-full bg-black/50">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1, delayChildren: 0.1 }}
                className="relative bg-[#292e34] max-w-96 gap-3 flex flex-col min-w-80 py-8 px-5 rounded-md border-2 border-white/5">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: .2 }}
                    className="shadow" />
                <Suspense>
                    {children}
                </Suspense>
            </motion.div>
        </div>
    </ModalProvider>;
}

