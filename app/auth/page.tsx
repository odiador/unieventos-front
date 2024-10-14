"use client";
import { validateMail } from "@/api/utils/api";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");
    async function validate() {
        setLoading(true);
        const response = await validateMail(email);
        console.log(response);

        if (response.status === 200) {
            router.push(`/auth/login?mail=${encodeURIComponent(email)}`)
        } else {
            let msg = response.data.message.replace("validateMail.arg0: ","")
            if (msg)
                setEmailMessage(msg)
        }
        setLoading(false);
    }
    return (<>
        <h1 className="text-left text-2xl font-semibold">Bienvenido a Unieventos</h1>
        <p className="text-left text-sm opacity-80 font-normal">Inicia Sesión o crea tu cuenta</p>
        <input type="email"
            className="bg-[#131517]/30 border-2 w-full border-white/10 rounded-md h-10 px-2 text-white selection:bg-cyan-700 focus:outline-none focus:border-white/50 transition-colors"
            value={email}
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
        />
        {emailMessage && <p className="validator-message">{emailMessage}</p>}
        <button onClick={(() => validate())} type="button" className="flex items-center justify-center">
            {loading && <IconLoader className="animate-spin text-black/50" />}
            {!loading && "Iniciar Sesión"}
        </button>
    </>);
}