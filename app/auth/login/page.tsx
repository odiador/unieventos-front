"use client";
import { useModal } from "@/components/modal";
import { useRouter } from "next/navigation";
import { Suspense } from "react";


export function Login() {
    const router = useRouter();
    const {openModal} = useModal();
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Elige una opción de inicio</h1>
            <button onClick={(() => router.push(`/auth/login/password`))} type="button" className="">Usa tu contraseña</button>
            <button onClick={(() => openModal("Not yet implemented"))} type="button" className="button-secondary">Usa un código de seguridad</button>
            <button onClick={(() => router.back())} type="button" className="button-terciary">Volver</button>
        </>);
}

export default function LoginComponent() {
    return <Suspense>
        <Login />
    </Suspense>
}