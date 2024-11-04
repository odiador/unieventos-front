"use client";
import { useAuthContext } from "@/api/utils/auth";
import { BadRequestFieldsDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";


function Password() {
    const router = useRouter();
    const [passwordMessage, setPasswordMessage] = useState("");
    const [mailMessage, setMailMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { openModal } = useModal();
    const { signin } = useAuthContext();
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formdata = new FormData(e.currentTarget);
        const email = formdata.get("email");

        const password = formdata.get("password");
        if (!email || !password)
            return;
        const response = await signin(email.toString(), password.toString())
        if (response.status === 200) {
            setLoading(false);
            router.push("/home");
        } else {
            switch (response.status) {
                case 400:
                    const found = { password: false, email: false }
                    const errorData = response.data as unknown as BadRequestFieldsDTO;;
                    if (errorData.errors)
                        errorData.errors.forEach((e: { field: string; message: string }) => {
                            if (!password && e.field === "password") {
                                setPasswordMessage(e.message)
                                found.password = true;
                            }
                            if (!email && e.field === "email") {
                                setMailMessage(e.message)
                                found.email = true;
                            }
                        });
                    if (found.email == false) setMailMessage("")
                    if (found.password == false) setPasswordMessage("")

                    break;
                case 409:
                    router.push(`/auth/activate?email=${encodeURIComponent(email?.toString() || "")}`)
                    break;
                default:
                    if (response.data && response.data.message) {
                        openModal(response.data.message)
                        setMailMessage("")
                        setPasswordMessage("")
                    } else {
                        openModal("Internal server error: " + response.status)
                    }
                    break;
            }
            setLoading(false);
        }
    }
    return (
        <form className="gap-2 flex flex-col w-full" onSubmit={handleSubmit}>
            <h1 className="text-left text-2xl font-semibold">Inicia Sesión</h1>
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu correo electrónico</p>
            <input
                name="email"
                id="email"
                placeholder="Correo electrónico"
                type="email"
                required
            />
            {mailMessage && <p className="validator-message">{mailMessage}</p>}
            <p className="text-left text-sm opacity-80 font-normal">Ingresa tu contraseña</p>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                required
            />
            <p className="validator-message">{passwordMessage}</p>
            <button type="submit" className="flex justify-center items-center">
                {loading && <IconLoader className="animate-spin text-black/50" />}
                {!loading && "Iniciar Sesión"}</button>
            <button onClick={(() => router.back())} type="button" className="button-secondary">Volver</button>
        </form>
    );
}
export default function LoginWPassword() {
    return <Suspense>
        <Password />
    </Suspense>
}