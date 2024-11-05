"use client";
import { Login } from "@/components/login";
import { useModal } from "@/components/modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


export default function LoginComponent() {
    const router = useRouter();
    const { openModal } = useModal();
    const source = useSearchParams().get("source");
    const goCode = () => openModal("Not yet implemented");
    const goPassword = () => router.push(`/auth/login/password?source=${encodeURIComponent(source || '')}`);
    return <Suspense>
        <Login back={() => router.back()} onCode={goCode} onPassword={goPassword} />
    </Suspense>
}