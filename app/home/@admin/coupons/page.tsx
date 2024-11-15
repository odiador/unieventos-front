"use client";

import { getCoupons } from "@/api/utils/api";
import { BadRequestFieldsDTO, CouponInfoDTO, ErrorDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const m: { [name: string]: string } = {
    "AVAILABLE": "Disponible",
    "UNAVAILABLE": "No disponible",
    "DELETED": "Eliminado"
}

const CouponPage = () => {


    const [page, setPage] = useState(0);
    const [size, setSize] = useState(1);
    const [coupons, setCoupons] = useState<CouponInfoDTO[]>([]);
    const [status, setStatus] = useState<"AVAILABLE" | "UNAVAILABLE" | "DELETED">("AVAILABLE");
    const { openModal } = useModal();
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
    return (
        <div className="w-full p-2 gap-2 flex flex-col">
            <div className="w-full flex flex-col gap-2 p-2 bg-black/10 items-center">
                <div className="flex mt-4 justify-center items-center gap-2 w-full">
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
                    <select className="bg-[#34393e]" onChange={(e => setSize(Number(e.target.value)))}>
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
                                        <button className="w-fit">Editar</button>
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
