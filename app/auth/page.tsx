"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";


export default function Auth() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const source = searchParams.get("source");
    return (
        <>
            <Link href={`/auth/login?source=${source}`} className="button">Inicia sesión</Link>
            <Link href={`/auth/signup?source=${source}`} className="button button-terciary">Regístrate</Link>
            <button onClick={() => router.back()} className="button button-secondary">Volver</button>
        </>
    )
}