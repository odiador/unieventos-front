"use client";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const validateMail = async () => {
        setLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/validateMail?mail=${encodeURIComponent(email)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(e => {
            setLoading(false);
            if (e.ok) {
                router.push(`/auth/login?mail=${encodeURIComponent(email)}`)
            } else {
                e.json().then(json => {
                    if (e.status == 400) {
                        alert("Debe ser una dirección de correo electrónico con formato correcto")
                    } else if (e.status == 404) {
                        alert(json.message)
                    } else if (e.status == 409) {
                        alert(json.message)
                    }
                })
            }
        });
    }
    return (<>
        <h1 className="text-center text-2xl font-semibold">Bienvenido a Unieventos</h1>
        <p className="text-left text-sm opacity-80 font-normal">Inicia Sesión o crea tu cuenta</p>
        <input type="email"
            className="bg-[#131517]/30 border-2 w-full border-white/10 rounded-md h-10 px-2 text-white selection:bg-cyan-700 focus:outline-none focus:border-white/50 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={(() => validateMail())} type="button" className="flex items-center justify-center">
            {loading && <IconLoader className="animate-spin text-black/50" />}
            {!loading && "Iniciar Sesión"}
        </button>
    </>);
}