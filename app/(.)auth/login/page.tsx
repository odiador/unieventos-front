"use client";

import { Login } from "@/components/login";
import { useModal } from "@/components/modal";
import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { openModal } = useModal();
    return <Login back={() => router.back()} useCode={() => openModal("Not yet implemented")} usePassword={() => router.push("/auth/login/password")} />
}