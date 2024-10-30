"use client";
import { useAuthContext } from "@/api/utils/auth";
import { IconBrandAuth0, IconBrandOauth, IconDots, IconLogin, IconLogout2, IconRegistered, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

const Header = () => {
    const headerValues = [
        {
            id: "events",
            name: "Eventos",
            href: "/events"
        },
        {
            id: "cals",
            name: "Calendarios",
            href: "/calendars"
        },
    ]
    const { account, signout } = useAuthContext();
    const { updateRole } = useAuthContext();
    useEffect(() => { updateRole() }, [])
    return (
        <header className="sticky top-0 bg-black/10 z-50 backdrop-blur-lg flex justify-center items-stretch w-full px-4 py-2 gap-2">
            <div className="grow h-full flex items-center gap-1 sm:justify-normal justify-between">
                <Link href={"/"} className="px-3 text-2xl font-extrabold text-white/70 hover:text-white transition-colors select-none">{"amaTickets"}</Link>
                <div className="hidden gap-[2px] shrink sm:flex items-center">
                    {account && account.role === "ADMINISTRATOR" && <Link key="dashboard" className="px-2 relative text-lg transition-colors font-semibold text-white/50 hover:text-white" href={"/dashboard"}>Dashboard</Link>}
                    {headerValues.map(values => {
                        return (
                            <div key={values.id}>
                                {<label>|</label>}
                                <Link
                                    className="px-2 relative text-lg transition-colors font-semibold text-white/50 hover:text-white"
                                    href={values.href}>
                                    {values.name}
                                </Link>
                            </div>)
                    })}
                </div>
                <div className="block sm:hidden">
                    <button className="button-icon" onClick={() => { }}>
                        <IconDots />
                    </button>
                </div>
            </div>
            {account && <button className="hidden sm:block" onClick={() => signout()}>Cerrar Sesión</button>}
            {account && <button className="block sm:hidden button-icon" onClick={() => signout()}><IconLogout2 /></button>}
            {!account && <Link href={"/auth/login"} className="button sm:block hidden">Inicia Sesión</Link>}
            {!account && <Link href={"/auth/login"} className="button block sm:hidden button-icon"><IconLogin /></Link>}
            {!account && <Link href={"/auth/signup"} className=" sm:block hidden button button-secondary">Regístrate</Link>}
            {!account && <Link href={"/auth/signup"} className="button button-secondary button-icon block sm:hidden"><IconUserPlus /></Link>}
        </header>
    );
}
export default Header;