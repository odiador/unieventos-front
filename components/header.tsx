"use client";
import { useAuthContext } from "@/api/utils/auth";
import { CartDetailDTO } from "@/api/utils/schemas";
import { IconDots, IconLogin, IconLogout2, IconShoppingCart, IconUser, IconUserCheck, IconUserPlus, IconX } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CardShadow from "./cardshadow";
import { useModal } from "./modal";
import { openCartAction } from "./rightBarCarts";

const Header = () => {
    const { closeRightBar, openRightBar, openCustomModal, closeModal, openModal } = useModal();
    const source = usePathname();
    const headerValues = [
        {
            id: "events",
            name: "Eventos",
            href: "/home/events"
        },
        {
            id: "cals",
            name: "Calendarios",
            href: "/home/calendars"
        },
    ]
    const [items, setItems] = useState<CartDetailDTO[]>();
    const { account, signout, updateRole } = useAuthContext();
    useEffect(() => { updateRole() }, [])

    return (
        <header className="sticky top-0 bg-black/10 z-50 backdrop-blur-lg flex justify-center items-stretch w-full px-4 py-2 gap-2">
            <div className="grow h-full flex items-center gap-1 sm:justify-normal justify-between">
                <Link href={"/"} className="px-3 text-2xl font-extrabold text-white/70 hover:text-white transition-colors select-none">{"amaTickets"}</Link>
                <div className="hidden gap-[2px] shrink sm:flex items-center">
                    {account && <Link key="home" className="px-2 relative text-lg transition-colors font-semibold text-white/50 hover:text-white" href={"/home"}>Home</Link>}
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
                    <button className="button-icon" onClick={() => {
                        openRightBar(<motion.div
                            className="max-w-full sm:max-w-96 h-full gap-2 flex flex-col px-8 sm:pl-8 sm:pr-2"
                            transition={{ duration: 0.2, delay: 0.1 }}
                            initial={{ width: "0px" }}
                            animate={{ width: "100%" }}
                        >
                            <CardShadow>
                                <IconX className="self-end hover:scale-150 scale-125 transition-transform cursor-pointer"
                                    onClick={() => closeRightBar()} />
                                {account && <Link key="home" className="button w-full relative" href={"/home"}>Home</Link>}
                                {headerValues.map(values => {
                                    return (
                                        <Link
                                            key={values.id}
                                            className="button w-full relative"
                                            href={values.href}>
                                            {values.name}
                                        </Link>
                                    )
                                })}
                                {account && account.role == "CLIENT" && <button key="carts"
                                    className="flex justify-center items-center"
                                    onClick={() => openCartAction(openRightBar, closeRightBar, true, setItems, items, openCustomModal, closeModal, openModal)}
                                ><IconShoppingCart /></button>}
                            </CardShadow>
                        </motion.div>)
                    }}>
                        <IconDots />
                    </button>
                </div>
            </div>
            {account && account.role == "CLIENT" && <button key="carts"
                className="button-icon"
                onClick={() => openCartAction(openRightBar, closeRightBar, true, setItems, items, openCustomModal, closeModal, openModal)}
            ><IconShoppingCart /></button>}
            {<button className="button-icon" onClick={() => {
                openRightBar(<motion.div
                    className="max-w-full sm:max-w-96 h-full gap-2 flex flex-col px-8 sm:pl-8 sm:pr-2"
                    transition={{ duration: 0.2, delay: 0.1 }}
                    initial={{ width: "0px" }}
                    animate={{ width: "100%" }}
                >
                    <CardShadow>
                        <IconX className="self-end hover:scale-150 scale-125 transition-transform cursor-pointer"
                            onClick={() => closeRightBar()} />

                        {!account && <Link href={`/auth/login?source=${encodeURIComponent(source)}`} className="button flex items-center justify-center gap-1" onClick={() => closeRightBar()} ><IconLogin />Inicia Sesión</Link>}
                        {!account && <Link href={`/auth/signup?source=${encodeURIComponent(source)}`} className="button flex items-center justify-center gap-1 button-secondary" onClick={() => closeRightBar()} ><IconUserPlus />Regístrate</Link>}
                        {account && <div className="flex w-full flex-col">
                            <label className="w-full text-center break-all">{account.email}</label>
                            <label className="w-full font-bold text-center break-all">{account.role}</label>
                        </div>}
                        {account && <Link href={`/home/account`} className="button flex items-center justify-center gap-1" onClick={() => closeRightBar()} ><IconUser />Gestionar Cuenta</Link>}
                        {account && account.role == "CLIENT" && <Link href={`/home/orders`} className="button flex items-center justify-center gap-1" onClick={() => closeRightBar()} ><IconUser />Ver Ordenes</Link>}
                        {account && account.role == "CLIENT" && <Link href={`/home/orderhistory`} className="button flex items-center justify-center gap-1" onClick={() => closeRightBar()} ><IconUser />Ver Historial de Compras</Link>}
                        <div className="h-full flex place-items-end w-full">
                            {account && <button className="w-full button flex items-center justify-center gap-1 button-secondary" onClick={() => { signout(); closeRightBar(); }}><IconLogout2 />Cerrar Sesión</button>}
                        </div>
                    </CardShadow>
                </motion.div>)
            }}>{account ? <IconUserCheck /> : <IconUser />}</button>}
        </header>
    );
}
export default Header;
