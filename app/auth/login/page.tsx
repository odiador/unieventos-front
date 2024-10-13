"use client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mail = searchParams.get("mail");
    if (!mail)
        redirect("/auth")
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Elige una opción de inicio</h1>
            <button onClick={(() => router.push(`/auth/login/password?mail=${encodeURIComponent(mail)}`))} type="button" className="">Usa tu contraseña</button>
            <button onClick={(() => router.push("/auth"))} type="button" className="button-secondary">Usa un código de seguridad</button>
            <button onClick={(() => router.push(`/auth`))} type="button" className="button-terciary">Volver</button>
        </>);
}

export default function LoginComponent() {
    return <Suspense>
        <Login />
    </Suspense>
}