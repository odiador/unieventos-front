"use client";
import { Login } from "@/components/login";
import { useModal } from "@/components/modal";
import { useRouter } from "next/navigation";
import { Suspense } from "react";


export default function LoginComponent() {
    const router = useRouter();
    const { openModal } = useModal();
    return <Suspense>
        <Login back={() => router.back()} onCode={() => openModal("Not yet implemented")} onPassword={() => router.push("/auth/login/password")} />
    </Suspense>
}