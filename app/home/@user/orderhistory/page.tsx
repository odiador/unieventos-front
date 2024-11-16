"use client";

import { findAllOrders } from "@/api/utils/api";
import { BadRequestFieldsDTO, ErrorDTO, OrderDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import { IconLoader } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";


const OrdersPage = () => {
    const [orders, setOrders] = useState<OrderDTO[]>();
    const { openModal } = useModal();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const jwt = getCookie("jwt");
        if (jwt) {
            setLoading(true);
            findAllOrders(jwt).then(response => {
                if (response.status == 200) {
                    setOrders(response.data.response || undefined);
                } else if (response.status == 400) {
                    const data = response.data as unknown as BadRequestFieldsDTO;
                    openModal(data.message);
                } else {
                    const data = response.data as unknown as ErrorDTO;
                    openModal(data.message);
                }
                setLoading(false);
            })
        } else {
            openModal("No hay login");
        }
    }, []);
    useEffect(() => {
        if (orders) {
            console.log({ orders });
        }
    }, [orders])
    return (
        <div className="size-full flex">
            {loading && (
                <div className="flex items-center justify-center w-full h-full">
                    <IconLoader className="animate-spin" />
                </div>
            )}
            {!loading && orders && orders.length == 0 && (<div className="w-full text-center text-4xl font-bold">No tienes ordenes</div>)}
            {!loading && orders && orders.length > 0 && (
                <div className="flex flex-col size-full gap-2 px-4 py-2">
                    {orders.map(order => {
                        const time = new Date(order.timestamp);
                        return (
                            <Link key={order.id} className="flex flex-col break-all bg-white/5 px-5 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer" href={`/home/orders/${encodeURIComponent(order.id)}`}>
                                <label className="text-sm text-white/70 mb-2 pointer-events-none">{`Fecha de creación: ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}</label>
                                <label className="pointer-events-none">{`Cantidad de items: ${order.items.length}`}</label>
                                <label className="pointer-events-none">{`Total: ${order.total}`}</label>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default OrdersPage;
