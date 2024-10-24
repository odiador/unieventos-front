"use client";
import { useAuthContext } from "@/api/utils/auth";
import Link from "next/link";
import { useEffect } from "react";

const Header = () => {
    const { account, signout } = useAuthContext();
    const { updateRole } = useAuthContext();
    useEffect(() => { updateRole() }, [])
    return (
        <header className="sticky top-0 bg-black/10 z-50 backdrop-blur-lg flex flex-col justify-center items-stretch sm:flex-row w-full px-4 py-2 gap-2">
            <div className="grow">
                <Link href={"/"} className="px-2 text-2xl font-extrabold text-white/70 select-none">{"amaTickets"}</Link>
            </div>
            {account && <button onClick={() => signout()}>Cerrar Sesión</button>}
            {!account && <Link href={"/auth/login"} className="button">Inicia Sesión</Link>}
            {!account && <Link href={"/auth/signup"} className="button button-secondary">Regístrate</Link>}
        </header>
    );
}
export default Header;