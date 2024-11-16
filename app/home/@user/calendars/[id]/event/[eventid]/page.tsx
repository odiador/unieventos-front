"use client";
import { addItemToCart, findEvent } from "@/api/utils/api";
import { useAuthContext } from "@/api/utils/auth";
import { CartDetailDTO, FindEventDTO, FindEventLocalityDTO } from "@/api/utils/schemas";
import { formatTime } from "@/api/utils/util";
import { useModal } from "@/components/modal";
import { openCartAction } from "@/components/rightBarCarts";
import { IconAddressBook, IconCash, IconCategory2, IconMapPin, IconShoppingCart, IconShoppingCartPlus, IconTextCaption, IconUser, IconUsersGroup } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { loggedIn, account } = useAuthContext();
    const [items, setItems] = useState<CartDetailDTO[]>();
    const router = useRouter();
    const { openCustomModal, openRightBar, closeRightBar, openModal, closeModal } = useModal();
    useEffect(() => {

        findEvent({ idCalendar: params.id, idEvent: decodeURIComponent(params.eventid) }).then((response) => {
            if (response.status == 200) {
                setEvent(response.data.response);
                setLoading(false);
            } else {
                setEvent(null);
                setLoading(false);
            }
        })
    }, []);
    function addToCart(loc: FindEventLocalityDTO): void {
        if (!loggedIn()) {
            openCustomModal(
                <div className="p-4 sm:w-2/3 max-w-xl bg-black/90 rounded-lg border-2 border-white/20 gap-8 flex flex-col">
                    {"Necesitas tener una sesión activa primero"}
                    <div className="flex sm:flex-row flex-col w-full gap-4">
                        <button className="flex-1" onClick={() => {
                            router.push(`/auth?source=${encodeURIComponent(window?.location?.href)}`)
                            closeModal();
                        }}>Entrar</button>
                        <button className="flex-1 button-secondary" onClick={() => closeModal()}>Cancelar</button>
                    </div>
                </div >);
            return;
        }
        if (!getCookie("cart")) {
            if (account)
                openCartAction(openRightBar, closeRightBar, true, setItems, items, openCustomModal, closeModal, openModal)
            return;
        }
        const maxQuantity = loc.maxCapability - loc.ticketsSold;
        const onSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const formQuantity = formdata.get("quantity")?.toString();
            const quantity = Number.parseInt(formQuantity || "0");
            const cartId = getCookie("cart");
            if (cartId) {
                addItemToCart(
                    {
                        calendarId: params.id,
                        cartId: cartId,
                        eventId: decodeURIComponent(params.eventid),
                        localityId: loc.id,
                        quantity: quantity
                    }, getCookie("jwt") || "").then((response) => {
                        console.log(response.status);
                        console.log(response.data);
                        if (response.status == 200) {

                        }

                    })
            }
        };
        openCustomModal(
            <form onSubmit={onSubmit}
                className="rounded-lg bg-[#292e34] p-2 flex flex-col gap-2">
                <label>Ingresa una cantidad</label>
                <input
                    type="number"
                    max={maxQuantity}
                    name="quantity"
                    placeholder="Cantidad a comprar" />
                <p className="validator-message">{`Máximo ${maxQuantity}`}</p>
                <div className="flex gap-1">
                    <button type="submit">Agregar</button>
                    <button type="button" className="button-secondary" onClick={() => closeModal()}>Cancelar</button>
                </div>
            </form>
        )
    }
    return <>
        {!loading && !eventFound && <label>No fue encontrado</label>}
        {loading && <label>Cargando...</label>}

        {eventFound && (
            generateEvents()
        )}
    </>

    function generateEvents() {
        const event = eventFound as FindEventDTO;
        const startTime = new Date(event.startTime);
        const startDate = startTime.toLocaleDateString();
        const endTime = new Date(event.endTime);
        const endDate = endTime.toLocaleDateString();
        return <div className="flex flex-col gap-2 p-2 items-center relative">
            <label className="text-white/50 w-full">
                {startDate === endDate ?
                    `${startDate} ${formatTime(startTime)} - ${formatTime(endTime)}`
                    :
                    `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`}
            </label>
            <label className="border-0 bg-transparent font-bold text-white text-5xl"
            >{event.name}</label>
            <div className="flex gap-2">
                <Image className="w-1/3 h-fit rounded-lg" src={event.eventImage} alt="event image" width={1024} height={1024} />
                <div className="flex flex-col w-full justify-between gap-2 pb-2">
                    <textarea className="w-full h-full p-2" readOnly defaultValue={event.description} />
                    <div className="flex gap-2 flex-wrap h-fit">
                        <section className="flex items-center gap-1 justify-center">
                            <IconMapPin />{event.city}
                        </section>
                        <section className="flex items-center gap-1 justify-center">
                            <IconAddressBook />{event.address}
                        </section>
                        <section className="flex col-span-2 items-center gap-1 justify-center">
                            <IconCategory2 />{event.type}
                        </section>
                    </div>
                    <div className="flex gap-1 w-full flex-wrap justify-end self-end">
                        {event.tags.map(tag => {
                            return (
                                <label key={tag.name} className="rounded-full text-sm px-2 py-0.5" style={{
                                    background: tag.color,
                                    color: tag.textColor
                                }}>
                                    {tag.name}
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Link href={`/home/calendars/${params.id}`}><button>Ver Calendario</button></Link>
            <hr className="w-full h-px border-0 bg-white/10" />

            {event.localities.length <= 0 && "No puedes inscribirte a este evento"}
            {event.localities.length > 0 && <div className="">

                <label>Localidades</label>

                <div className="grid grid-cols-5 w-full bg-black/5 border-2 border-white/10 rounded-md">

                    <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconTextCaption />{"Nombre"}</div>
                    <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconCash />{"Precio"}</div>
                    <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconUser />{"Tickets vendidos"}</div>
                    <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconUsersGroup />{"Capacidad máxima"}</div>
                    <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconShoppingCart />{"Carrito"}</div>
                    {
                        event.localities.map((loc, i) => {
                            return (
                                <div key={loc.name} className="grid grid-cols-5 w-full col-span-5 content-center py-1"
                                    style={{ background: i % 2 == 0 ? "transparent" : "#ffffff0a" }}>
                                    <label className="text-center items-center">{loc.name}</label>
                                    <label>{loc.price}</label>
                                    <label>{loc.ticketsSold}</label>
                                    <label>{loc.maxCapability}</label>
                                    <div className="w-full justify-center flex">
                                        <button onClick={() => addToCart(loc)} className="button-icon text-sm"><IconShoppingCartPlus height={20} width={20} /></button>
                                    </div>
                                </div>)
                        })
                    }
                </div>
            </div>}
            <button type="button" className="button-secondary" onClick={() => router.back()}>Volver</button>
        </div>;
    }
}



export default EventPage;
