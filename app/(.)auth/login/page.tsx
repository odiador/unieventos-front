"use client";

import { Login } from "@/components/login";
import { useModal } from "@/components/modal";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { openModal } = useModal();
    return <Login back={() => router.back()} onCode={() => openModal("Not yet implemented")} onPassword={() => router.push("/auth/login/password")} />
}