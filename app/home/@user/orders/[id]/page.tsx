"use client";

import { findOrder, payOrder } from "@/api/utils/api";
import { BadRequestFieldsDTO, ErrorDTO, OrderDTO } from "@/api/utils/schemas";
import CardShadow from "@/components/cardshadow";
import { useModal } from "@/components/modal";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Cart = ({ params }: { params: { id: string } }) => {
    const { openModal } = useModal();
    const [orderData, setOrderData] = useState<OrderDTO>();
    const [extraData, setExtraData] = useState<{ date: Date }>();
    const router = useRouter();

    useEffect(() => {
        const jwt = getCookie("jwt");
        if (jwt) {
            findOrder(params.id, jwt).then(response => {
                if (response.status == 200) {
                    setOrderData(response.data.response || undefined);
                } else {
                    openModal(response.data.message)
                }
            })
        } else {
            openModal("No hay login")
        }

    }, [])

    useEffect(() => {
        if (orderData)
            setExtraData({ date: new Date(orderData.timestamp) })
    }, [orderData])
    return (
        <div className="w-full p-2">
            {!orderData && <div> No hay carrito</div>}
            {orderData && <CardShadow className="gap-0">
                <div className="w-full flex flex-col gap-0 pb-4">
                    <h1 onClick={() => {
                        alert(JSON.stringify(orderData.payment))
                        alert(JSON.stringify(orderData.status))
                    }} className="text-3xl font-bold">Tu orden</h1>
                    {extraData && <label className="text-sm text-white/70 mb-2">{`Ult. modificación: ${extraData.date.toLocaleDateString()} ${extraData.date.toLocaleTimeString()}`}</label>}
                </div>
                <div className="flex lg:hidden flex-col w-full px-4">
                    <h1 className="text-3xl font-semibold text-nowrap">Resumen del pedido</h1>
                    <p className="text-white/70">{`${orderData.items.length} artículo${orderData.items.length == 1 ? "" : "s"}`}</p>
                    <hr className="h-px border-0 w-full bg-white/10 my-4" />
                </div>
                <div className="flex lg:flex-row flex-col items-start gap-2">
                    <div className="w-full grid grid-cols-7 place-items-center gap-x-[1px]">
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Imagen</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Calendario</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Evento</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Localidad</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Valor Unitario</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Cantidad</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Precio</label>
                        {orderData.items.map((item, idx) => {
                            const clsName = `text-sm bg-white/${idx % 2 == 0 ? "5" : "10"} w-full h-full text-center content-center break-all`;
                            return (
                                <div className="w-full break-allrounded-md grid grid-cols-7 col-span-7 gap-x-[1px] place-items-center"
                                    key={item.calendarId + item.eventId + item.localityId}>
                                    <div className={`text-sm bg-white/${idx % 2 == 0 ? "5" : "10"} w-full h-full text-center flex justify-center items-center`}>
                                        <Image
                                            className="w-10 h-fit"
                                            src={item.eventImage}
                                            alt={"Imagen item carrito"}
                                            width={512}
                                            height={512} />
                                    </div>
                                    <label className={clsName}>{item.calendarName}</label>
                                    <label className={clsName}>{item.eventName}</label>
                                    <label className={clsName}>{item.localityName}</label>
                                    <label className={clsName}>{`$${item.price}`}</label>
                                    <label className={clsName}>{item.quantity}</label>
                                    <label className={clsName}>{`$${item.price * item.quantity}`}</label>
                                </div>
                            )
                        })
                        }

                    </div>
                    <form className="flex flex-col lg:w-fit w-full px-4" onSubmit={(e) => {
                        e.preventDefault();
                        const jwt = getCookie("jwt");
                        if (jwt) {
                            payOrder(params.id, jwt).then(response => {
                                if (response.status == 201) {
                                    const data = response.data.response;
                                    if (data) {
                                        router.push(data.url)
                                    } else {
                                        openModal("No hay URL");
                                    }
                                } else if (response.status == 400) {
                                    const data = response.data as unknown as BadRequestFieldsDTO;
                                    openModal(JSON.stringify(data))
                                } else {
                                    const data = response.data as unknown as ErrorDTO;
                                    openModal(data.message)
                                }
                            })
                        } else {
                            openModal("No hay login");
                        }

                    }}>

                        <div className="lg:flex hidden flex-col w-fit px-4">
                            <h1 className="text-3xl font-semibold text-nowrap">Resumen del pedido</h1>
                            <p className="text-white/70">{`${orderData.items.length} artículo${orderData.items.length == 1 ? "" : "s"}`}</p>
                            <hr className="h-px border-0 bg-white/10 my-4" />
                        </div>
                        <div className="w-full flex items-center justify-center">

                        </div>
                        <h3>{`Valor a pagar: $${orderData.total}`}</h3>
                        <div className="flex w-full gap-2 sm:gap-4 lg:gap-2 sm:flex-row flex-col">
                            <button className="w-full button-secondary" type="button" onClick={() => router.back()}>Volver</button>
                            <button className="w-full" type="submit">Continuar con MercadoPago</button>
                        </div>
                    </form>
                </div>
            </CardShadow >}
        </div >
    );
}

export default Cart;
