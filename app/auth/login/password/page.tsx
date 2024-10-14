"use client";
import { login } from "@/api/utils/api";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";


function Login() {
    const searchParams = useSearchParams();
    const mailString = searchParams.get("mail");
    const router = useRouter();
    const [password, setPassword] = useState("");

    const [mail, setMail] = useState(mailString?.toString() || "");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [mailMessage, setMailMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {openModal} =useModal();
    const doLogin = async () => {
        setLoading(true);
        const response = await login(mail, password);
        if (response.status === 200) {
            setLoading(false);
            console.log(response.data);
            
            openModal(response.data.toString())
        } else {
            switch (response.status) {
                case 400:
                    const found = { password: false, mail: false }
                    response.data.errors.forEach((e: { field: string; message: string }) => {
                        if (e.field === "password") {
                            setPasswordMessage(e.message)
                            found.password = true;
                        } else if (e.field === "email") {
                            setMailMessage(e.message)
                            found.mail = true;
                        }
                    });
                    if (found.mail == false) setMailMessage("")
                    if (found.password == false) setPasswordMessage("")

                    break;
                default:
                    openModal(response.data.message)
                    setMailMessage("")
                    setPasswordMessage("")
                    break;
            }
            setLoading(false);
        }
    }
    return (
        <>
            <h1 className="text-left text-2xl font-semibold">Inicia Sesión</h1>
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu correo electrónico</p>
            <input type="email"
                value={mail}
                onChange={(e) => {
                    setMail(e.target.value)
                    router.replace(`/auth/login/password?mail=${encodeURIComponent(e.target.value)}`, undefined);
 
                    }} />
            {mailMessage && <p className="validator-message">{mailMessage}</p>}
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu contraseña</p>
            <input type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className="validator-message">{passwordMessage}</p>
            <button onClick={(() => doLogin())} type="button" className="flex justify-center items-center">
                {loading && <IconLoader className="animate-spin text-black/50" />}
                {!loading && "Iniciar Sesión"}</button>
            <button onClick={(() => router.back())} type="button" className="button-secondary">Volver</button>
        </>);
}
export default function LoginWPassword() {
    return <Suspense>
        <Login />
    </Suspense>
}