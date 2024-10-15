"use client";
import { signup } from "@/api/utils/api";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";


function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [name, setName] = useState("");
    const [nameValidation, setNameValidation] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [emailValidation, setEmailValidation] = useState("");
    const [cedula, setCedula] = useState("");
    const [cedulaValidation, setCedulaValidation] = useState("");
    const [city, setCity] = useState("");
    const [cityValidation, setCityValidation] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneValidation, setPhoneValidation] = useState("");
    const [address, setAddress] = useState("");
    const [addressValidation, setAddressValidation] = useState("");
    const values = { email, password, name, cedula, phone, city, adress: address };
    const { openModal } = useModal();
    const signUp = async () => {
        setLoading(true);
        const response = await signup(values);
        if (response.status == 201) {
            openModal(response.data.message)
        } else if (response.status === 400) {
            const found = { email: false, password: false, name: false, cedula: false, phone: false, city: false, address: false };
            if (response.data && response.data.errors) {
                response.data.errors.forEach((e: { field: string; message: string }) => {
                    if (!found.email && e.field === "email") {
                        found.email = true;
                        setEmailValidation(e.message);
                    }
                    if (!found.password && e.field === "password") {
                        found.password = true;
                        setPasswordValidation(e.message);
                    }
                    if (!found.name && e.field === "name") {
                        found.name = true;
                        setNameValidation(e.message);
                    }
                    if (!found.cedula && e.field === "cedula") {
                        found.cedula = true;
                        setCedulaValidation(e.message);
                    }
                    if (!found.phone && e.field === "phone") {
                        found.phone = true;
                        setPhoneValidation(e.message);
                    }
                    if (!found.city && e.field === "city") {
                        found.city = true;
                        setCityValidation(e.message);
                    }
                    if (!found.address && e.field === "adress") {
                        found.address = true;
                        setAddressValidation(e.message);
                    }

                })
            }
        } else if (response.status === 409) {
            openModal(response.data.message)
        } else if (response.status === 500) {
            openModal("Internal server error")
        }
        setLoading(false);
    }
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Crea tu cuenta</h1>
            <p>Cuéntanos un poco sobre tí</p>
            <hr className="h-px border-0 bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <p className="text-sm w-full">Ingresa tu dirección de correo electrónico</p>
                    <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className="validator-message">{emailValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm w-full">Ingresa tu contraseña</p>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p className="validator-message">{passwordValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm w-full">Confirma tu contraseña</p>
                    <input type="password" placeholder="Contraseña" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    <p className="validator-message">{password === passwordConfirmation ? "" : "Las contraseñas no coinciden"}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu Nombre</p>
                    <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="validator-message">{nameValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu cédula</p>
                    <input placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                    <p className="validator-message">{cedulaValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu teléfono</p>
                    <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <p className="validator-message">{phoneValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa la ciudad donde vives</p>
                    <input placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
                    <p className="validator-message">{cityValidation}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">Ingresa tu dirección de residencia</p>
                    <input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <p className="validator-message">{addressValidation}</p>
                </div>
            </div>
            <button onClick={((e) => {
                e.preventDefault();
                if (password === passwordConfirmation)
                    signUp()
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