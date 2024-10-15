"use client";
import { Login } from "@/components/login";
import { useModal } from "@/components/modal";
import { useRouter } from "next/navigation";
import { Suspense } from "react";


export default function LoginComponent() {
    const router = useRouter();
    const { openModal } = useModal();
    return <Suspense>
        <Login back={() => router.back()} useCode={() => openModal("Not yet implemented")} usePassword={() => router.push("/auth/login/password")} />
    </Suspense>
}