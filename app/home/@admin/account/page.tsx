"use client";

import { editUserData, getAccountInfo } from "@/api/utils/api";
import { useAuthContext } from "@/api/utils/auth";
import { AccountInfoDTO, BadRequestFieldsDTO } from "@/api/utils/schemas";
import CardShadow from "@/components/cardshadow";
import { deleteAccountModal } from "@/components/deleteAccountModal";
import { useModal } from "@/components/modal";
import { IconLoader, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AccountPage = () => {

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const router = useRouter();
    const [name, setName] = useState("");
    const [nameValidation, setNameValidation] = useState("");
    const [email, setEmail] = useState("");
    const [cedula, setCedula] = useState("");
    const [cedulaValidation, setCedulaValidation] = useState("");
    const [city, setCity] = useState("");
    const [cityValidation, setCityValidation] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneValidation, setPhoneValidation] = useState("");
    const [address, setAddress] = useState("");
    const [addressValidation, setAddressValidation] = useState("");
    const [editing, setEditing] = useState(false);
    const [accountInfo, setAccountInfo] = useState<AccountInfoDTO>();
    const { updateRole } = useAuthContext();
    const { openModal, openCustomModal, closeModal } = useModal();
    useEffect(() => {
        updateRole().then(v => {
            const jwt = getCookie("jwt");
            setEmail(v ? v.email : "");
            if (jwt) {
                getAccountInfo(jwt).then(response => {
                    if (response.status == 200) {
                        const accInfo = response.data.response;
                        if (accInfo) {
                            setAccountInfo(accInfo);
                            setCity(accInfo.city || "");
                            setAddress(accInfo.adress);
                            setCedula(accInfo.cedula);
                            setName(accInfo.name);
                            setPhone(accInfo.phone);
                        }
                    } else {
                        openModal(response.data.message);
                    }
                })
            }
        })
    }, [])

    const submit = () => {
        setLoading(true);
        const jwt = getCookie("jwt");
        if (!jwt) {
            openModal("No hay login");
            setLoading(false);
            return;
        }
        const userData = { adress: address, cedula, city, name, phone } as AccountInfoDTO;
        editUserData(userData, jwt).then(response => {
            if (response.status == 200) {
                openModal(response.data.message);
                setAccountInfo(userData);
            } else if (response.status === 400) {
                const found = { name: false, cedula: false, phone: false, city: false, address: false };

                const errorData = response.data as unknown as BadRequestFieldsDTO | undefined;
                if (errorData && errorData.errors) {
                    errorData.errors.forEach((e: { field: string; message: string }) => {
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
                alert(JSON.stringify(response))
                openModal("Internal server error")
            }
            setLoading(false);
        });
    }
    return (
        <div className="py-2 w-2/3">
            {!accountInfo && <div>No puedes ver esta información</div>}
            {accountInfo && <CardShadow>
                <h1 className="text-center text-2xl font-semibold">Tu cuenta</h1>
                <p className="text-white/70">Información de tu cuenta</p>
                <hr className="h-px border-0 bg-white/10" />
                <form className="flex flex-col gap-2.5" onSubmit={e => {
                    e.preventDefault();
                    submit();
                }}>
                    <div className="flex gap-2 justify-end items-center">
                        {editing ? "¿Deseas solo ver tu cuenta?" : "¿Deseas editar tu cuenta?"}
                        <button type="button"
                            onClick={() => {
                                if (editing) {
                                    setCity(accountInfo.city);
                                    setAddress(accountInfo.adress);
                                    setCedula(accountInfo.cedula);
                                    setName(accountInfo.name);
                                    setPhone(accountInfo.phone);
                                    setEditing(false);
                                } else {
                                    setEditing(true);
                                }
                            }}
                        >{editing ? "Restaurar información" : "Cambia los datos"}</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm w-full">{`Correo electrónico${editing ? " (no se puede cambiar)" : ""}`}</p>
                        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} readOnly />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Nombre</p>
                        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} readOnly={!editing} />
                        <p className="validator-message">{nameValidation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Cédula</p>
                        <input placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} readOnly={!editing} />
                        <p className="validator-message">{cedulaValidation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Teléfono</p>
                        <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!editing} />
                        <p className="validator-message">{phoneValidation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Ciudad</p>
                        <input placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} readOnly={!editing} />
                        <p className="validator-message">{cityValidation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Dirección</p>
                        <input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} readOnly={!editing} />
                        <p className="validator-message">{addressValidation}</p>
                    </div>

                    {editing && <button type="submit" >
                        {loading && <IconLoader className="animate-spin text-black/50" />}
                        {!loading && "Edita tu Cuenta"}
                    </button >}
                </form>

                <button className="button-danger" type="button" onClick={() => {
                    openCustomModal(deleteAccountModal(closeModal, openModal, router, () => {
                        updateRole().then()
                    }));
                }}>Borra la cuenta</button >
                <button onClick={(() => router.back())} type="button" className="button-terciary">Volver</button>
            </CardShadow>}
        </div>

    )
}
export default AccountPage;