"use client";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";


function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [cedula, setCedula] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const values = { email, password, name, cedula, phone, address };
    const { openModal } = useModal();
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Crea tu cuenta</h1>
            <p>Cuéntanos un poco sobre tí</p>
            <hr className="h-px border-0 bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full overflow-hidden">
                <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                    <p className="text-sm w-full">Ingresa tu dirección de correo electrónico</p>
                    <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className="validator-message">hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola </p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm w-full">Ingresa tu contraseña</p>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p className="validator-message">hola</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm w-full">Confirma tu contraseña</p>
                    <input type="password" placeholder="Contraseña" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    <p className="validator-message">{password === passwordConfirmation ? "" : "Las contraseñas no coinciden"}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu Nombre</p>
                    <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="validator-message">hola</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu cédula</p>
                    <input placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                    <p className="validator-message">hola</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu teléfono</p>
                    <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <p className="validator-message">hola</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu dirección de residencia</p>
                    <input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <p className="validator-message">hola</p>
                </div>
            </div>
            <button onClick={((e) => {
                e.preventDefault();
                if (password === passwordConfirmation)
                    openModal(JSON.stringify(values))
                else
                    openModal("Las contraseñas no coinciden")
            })} type="submit" >
                {loading && <IconLoader className="animate-spin text-black/50" />}
                {!loading && "Crea tu Cuenta"}
            </button >
            <button onClick={(() => router.back())} type="button" className="button-terciary">Volver</button>
        </>);
}

export default function LoginComponent() {
    return <Suspense>
        <Login />
    </Suspense>
}