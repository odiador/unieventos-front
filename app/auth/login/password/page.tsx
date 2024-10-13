"use client";
import { IconLoader, IconLoader2, IconLoaderQuarter, IconTruckLoading } from "@tabler/icons-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mail = searchParams.get("mail");
    if (!mail)
        redirect("/auth")
    const [password, setPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const login = async () => {
        setLoading(true);
        await fetch(`http://localhost:8080/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: mail, password })
            }
        ).then(e => {
            setLoading(false);
            if (e.ok) {
                alert("logged in")
            } else {
                e.json().then(json => {
                    if (e.status == 400) {
                        if (json.message) {
                            console.log(json.message);

                        } else {
                            json.errors.forEach((e: { field: string; message: string }) => {
                                if (e.field == "password") {
                                    setPasswordMessage(e.message)
                                }
                            });
                        }
                    }else {
                        console.log(json.message);
                        setPasswordMessage("")
                    }
                })
            }
        });
    }
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Bienvenido a Unieventos</h1>
            <p className="text-left text-sm opacity-80 font-normal">Inicia Sesión</p>
            <input type="password"
                className="bg-[#131517]/30 border-2 w-full border-white/10 rounded-md h-10 px-2 text-white selection:bg-cyan-700 focus:outline-none focus:border-white/50 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-400 text-sm relative -top-2">{passwordMessage}</p>
            <button onClick={(() => login())} type="button" className="flex justify-center items-center">
                {loading && <IconLoader className="animate-spin text-black/50" />}
                {!loading && "Iniciar Sesión"}</button>
            <button onClick={(() => router.push(`/auth/login?mail=${encodeURIComponent(mail)}`))} type="button" className="button-secondary">Volver</button>
        </>);
}