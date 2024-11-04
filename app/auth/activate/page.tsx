"use client";
import { activate, sendActivation } from "@/api/utils/api";
import { BadRequestFieldsDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


function Password() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [mailMessage, setMailMessage] = useState("");
    const [code, setPassword] = useState("");
    const [codeMessage, setCodeMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const searchParams = useSearchParams();
    useEffect(() => {
        setEmail(searchParams.get("email") || "")
    }, [])
    const { openModal } = useModal();
    const doActivate = async () => {
        const values = { email, code };
        setLoading(true);
        const response = await activate(values);
        if (response.status === 200) {
            setLoading(false);
            openModal(response.data.message)
            router.push(`/auth/login`)
        } else {
            switch (response.status) {
                case 400:
                    const errorData = response.data as unknown as BadRequestFieldsDTO;;
                    if (errorData.errors) {
                        const found = { code: false, mail: false }
                        errorData.errors.forEach((e: { field: string; message: string }) => {
                            if (!found.code && e.field === "code") {
                                setCodeMessage(e.message)
                                found.code = true;
                            }
                            if (!found.mail && e.field === "email") {
                                setMailMessage(e.message)
                                found.mail = true;
                            }
                        });
                        if (found.mail == false) setMailMessage("")
                        if (found.code == false) setCodeMessage("")
                    }
                    break;
                default:
                    if (response.data && response.data.message) {
                        openModal(response.data.message)
                        setMailMessage("")
                        setCodeMessage("")
                    } else {
                        openModal("Internal server error: " + response.status)
                    }
                    break;
            }
            setLoading(false);
        }
    }
    const doSendCode = async () => {
        setSendLoading(true);
        const response = await sendActivation(email);
        if (response.status === 200) {
            setSendLoading(false);
            openModal(response.data.message)
        } else {
            switch (response.status) {
                case 400:
                    setMailMessage(response.data.message.replace("resendActivationCode.arg0: ", ""))
                    break;
                default:
                    if (response.data && response.data.message) {
                        openModal(response.data.message)
                        setMailMessage("")
                        setCodeMessage("")
                    } else {
                        openModal("Internal server error: " + response.status)
                    }
                    break;
            }
            setSendLoading(false);
        }
    }
    return (
        <>
            <h1 className="text-left text-2xl font-semibold">Activa tu cuenta</h1>
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu correo electrónico</p>
            <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            {mailMessage && <p className="validator-message">{mailMessage}</p>}
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu código de activación</p>
            <input type="text"
                placeholder="Código"
                value={code}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className="validator-message">{codeMessage}</p>
            <button onClick={((e) => {
                e.preventDefault();
                doActivate();
            })} type="submit" className="flex justify-center items-center">
                {loading && <IconLoader className="animate-spin text-black/50" />}
                {!loading && "Activa tu cuenta"}</button>
            <button onClick={() => doSendCode()} className="button-terciary">
                {sendLoading && <IconLoader className="animate-spin text-white/50" />}
                {!sendLoading && "Envía otro código"}
            </button>
            <button onClick={(() => router.back())} type="button" className="button-secondary">Volver</button>
        </>);
}
export default function LoginWPassword() {
    return <Suspense>
        <Password />
    </Suspense>
}