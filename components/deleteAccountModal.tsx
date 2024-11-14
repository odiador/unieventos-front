"use client";

import { deleteAccount } from "@/api/utils/api";
import { IconX } from "@tabler/icons-react";
import { deleteCookie, getCookie } from "cookies-next";
import CardShadow from "./cardshadow";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const deleteAccountModal = (closeModal: () => void, openModal: (d: string) => void, router: AppRouterInstance, updateRole: () => void) => {
    return (
        <CardShadow>
            <IconX className="hover:scale-125 cursor-pointer transition-transform" onClick={() => closeModal()} />
            <form
                className="flex flex-col gap-2 h-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = formData.get("email")?.toString();
                    const password = formData.get("password")?.toString();
                    const jwt = getCookie("jwt")
                    if (email && password && jwt) {
                        deleteAccount({ email, password }, jwt).then(response => {
                            closeModal();
                            openModal(response.data.message);
                            updateRole();
                            deleteCookie("jwt");
                            router.refresh();
                            router.push("/");
                        })
                    } else {

                    }
                }}>
                <h1 className="w-full text-center text-2xl font-bold">Elimina la cuenta</h1>
                <label className="">Coloca tus credenciales para eliminar tu cuenta</label>
                <hr className="h-px border-0 bg-white/10" />
                <label className="">Ingresa el correo</label>
                <input name="email" className="" placeholder="Correo" type="email" />
                <label className="">Ingresa la contraseña</label>
                <input name="password" placeholder="Contraseña" type="password" />
                <div className="flex flex-1 gap-4 place-items-end justify-end w-full">
                    <button type="button" onClick={() => closeModal()}>Cancelar</button>
                    <button className="button-danger" type="submit">Elimina la cuenta</button>
                </div>
            </form>
        </CardShadow >
    )
}

export { deleteAccountModal };
