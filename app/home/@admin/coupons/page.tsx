"use client";

import { getCoupons } from "@/api/utils/api";
import { BadRequestFieldsDTO, CouponInfoDTO, ErrorDTO } from "@/api/utils/schemas";
import CardShadow from "@/components/cardshadow";
import { useModal } from "@/components/modal";
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { ReactNode, useEffect, useState } from "react";

const m: { [name: string]: string } = {
    "AVAILABLE": "Disponible",
    "UNAVAILABLE": "No disponible",
    "DELETED": "Eliminado"
}

const CouponPage = () => {


    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [coupons, setCoupons] = useState<CouponInfoDTO[]>([]);
    const [status, setStatus] = useState<"AVAILABLE" | "UNAVAILABLE" | "DELETED">("AVAILABLE");
    const { openModal, openCustomModal, closeModal } = useModal();
    function updateCoupons() {
        const jwt = getCookie("jwt");
        if (jwt) {
            getCoupons({ page, size, status }, jwt).then((response) => {
                if (response.status == 200) {
                    const r = response.data.response as CouponInfoDTO[];
                    setCoupons(r);
                } else if (response.status == 400) {
                    const error = response.data as unknown as BadRequestFieldsDTO;
                    openModal(JSON.stringify(error.errors));
                } else {
                    const error = response.data as unknown as ErrorDTO;
                    openModal(error.message);
                }
            });
        }
    }
    useEffect(() => {
        updateCoupons();
    }, [])

    function editCouponModal(c: CouponInfoDTO): ReactNode {
        return (<div>
            <CardShadow >
                <IconX className="self-end scale-110 hover:scale-125 transition-transform cursor-pointer" onClick={() => closeModal()} />
                <h1 className="text-xl font-bold">Edición de cupón</h1>
                <form className="grid grid-cols-2 gap-x-2 gap-y-1 w-full" onSubmit={(e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    alert("Editar cupón")
                    form.get("name");
                    form.get("code")
                    form.get("discount");
                    form.get("expiryDate");
                    form.get("status");
                    form.get("type");

                }}>
                    <label className="h-full content-center">Nombre</label>
                    <input required name="name" defaultValue={c.name} />
                    <label className="h-full content-center">Código</label>
                    <input required name="code" defaultValue={c.code} />
                    <label className="h-full content-center">Descuento (0% - 100%)</label>
                    <input required name="discount" defaultValue={c.discount} type="number" />
                    <label className="h-full content-center">Fecha de Expiración</label>
                    <input required name="expiryDate" defaultValue={c.expiryDate} type="datetime-local" />
                    <label className="h-full content-center">Status</label>
                    <select required name="status" defaultValue={c.status} >
                        <option>AVAILABLE</option>
                        <option>UNAVAILABLE</option>
                    </select>
                    <label className="h-full content-center">Tipo</label>
                    <select required name="type" defaultValue={c.type}>
                        <option>UNIQUE</option>
                        <option>MULTIPLE</option>
                    </select>
                    <button type="button" className="mt-4 button-danger" onClick={() => {
                        alert("Eliminar cupón")
                    }}>Eliminar</button>
                    <button type="submit" className="mt-4">Editar</button>
                </form>
            </CardShadow>
        </div>);
    }
    return (
        <div className="w-full p-2 gap-2 flex flex-col">
            <div className="w-full flex justify-center">
                <div className="w-fit rounded-md border-white/5 border-2 flex flex-col gap-2 py-4 px-2 bg-black/10 items-center">
                    <div className="flex mt-4 justify-center items-center gap-2 w-fit">
                        {"Página"}
                        <button className="button-icon" onClick={() => {
                            let n = page;
                            if (n > 0)
                                n = n - 1;
                            setPage(n);
                        }}>
                            <IconArrowLeft />
                        </button>

                        <input
                            className="w-fit"
                            type="number"
                            placeholder="Página"
                            onChange={e => setPage(Number(e.target.value))} value={page} />
                        <button className="button-icon"
                            onClick={() => {
                                setPage((pg) => pg + 1);
                            }}>
                            <IconArrowRight />
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <label className="text-nowrap">Tamaño de la página</label>
                        <select className="bg-[#34393e]" value={size} onChange={(e => setSize(Number(e.target.value)))}>
                            <option>2</option>
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                            <option>20</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <label className="text-nowrap">Status</label>
                        <select className="bg-[#34393e]" onChange={e => {
                            const value = e.target.value;
                            if (value === "AVAILABLE" || value === "UNAVAILABLE" || value === "DELETED")
                                setStatus(value)
                        }}>
                            <option>AVAILABLE</option>
                            <option>UNAVAILABLE</option>
                            <option>DELETED</option>
                        </select>
                    </div>
                    <button onClick={() => updateCoupons()}>Cambiar</button>
                </div>
            </div>
            {
                coupons && <div className="flex flex-col gap-2 ">
                    {
                        coupons.map((c, index) => {

                            return (
                                <div className="w-full flex bg-white/5 rounded-lg p-4" key={index}>
                                    <div className="flex flex-1 flex-col">
                                        <label className="text-2xl font-bold">{c.name}</label>
                                        <label className="text-2xl">{c.code}</label>
                                        <label >{c.type}</label>
                                        <label>{`${c.discount}%`}</label>
                                        <label>{`Expiración: ${new Date(c.expiryDate).toLocaleString()}`}</label>

                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <label className="w-full text-end">{`${m[c.status]}`}</label>
                                        {m[c.status] == "Disponible" && (
                                            <button className="w-fit"
                                                onClick={() => {
                                                    openCustomModal(editCouponModal(c))
                                                }}
                                            >Editar</button>)
                                        }
                                        {m[c.status] == "No Disponible" && (
                                            <button className="w-fit"
                                                onClick={() => {
                                                    alert("Cambiar status")
                                                }}
                                            >Activar</button>)
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div >
    );
}

export default CouponPage;
