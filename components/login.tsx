import { useRouter } from "next/navigation";
import { useModal } from "./modal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function Login({ usePassword, useCode, back, }: { usePassword: Function, useCode: Function, back: Function }) {
    const { openModal } = useModal();
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Elige una opción de inicio</h1>
            <button onClick={(() => usePassword())} type="button" className="">Usa tu contraseña</button>
            <button onClick={(() => useCode())} type="button" className="button-secondary">Usa un código de seguridad</button>
            <button onClick={(() => back())} type="button" className="button-terciary">Volver</button>
        </>);
}
export { Login };