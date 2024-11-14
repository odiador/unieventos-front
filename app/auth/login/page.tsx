"use client";
import { Login } from "@/components/login";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


export default function LoginComponent() {
    const router = useRouter();
    const source = useSearchParams().get("source");
    const goCode = () => router.push(`/auth/login/code?source=${encodeURIComponent(source || '')}`);
    const goPassword = () => router.push(`/auth/login/password?source=${encodeURIComponent(source || '')}`);
    return <Suspense>
        <Login back={() => router.back()} onCode={goCode} onPassword={goPassword} />
    </Suspense>
}