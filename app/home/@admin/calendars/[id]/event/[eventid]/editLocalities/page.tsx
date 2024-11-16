"use client";
import { editEvent, findEvent } from "@/api/utils/api";
import { FindEventDTO, FindEventLocalityDTO } from "@/api/utils/schemas";
import CardShadow from "@/components/cardshadow";
import { useModal } from "@/components/modal";
import { IconCash, IconEdit, IconLoader, IconTextCaption, IconUser, IconUsersGroup, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [eventLocalities, setEventLocalities] = useState<FindEventLocalityDTO[] | undefined>();
    const { openModal, openCustomModal, closeModal } = useModal();
    const router = useRouter();

    async function handleSubmit() {
        if (!buttonLoading) {
            setButtonLoading(true);
            const jwt = getCookie("jwt");
            if (jwt && eventLocalities) {
                console.log({ eventLocalities });
                editEvent({ idCalendar: params.id, idEvent: params.eventid, localities: eventLocalities }, jwt).then(response => {
                    if (response.status == 200) {
                        openModal(response.data.message+"h");
                        router.push(`/home/calendars/${params.id}/event/${params.eventid}`)
                    } else {
                        openModal(response.data.message);
                    }
                })
            } else {
                openModal("No hay login")
            }
            setButtonLoading(false);
        }
    }

    useEffect(() => {

        findEvent({ idCalendar: params.id, idEvent: decodeURIComponent(params.eventid) }).then((response) => {
            if (response.status == 200) {
                setEvent(response.data.response);
                setEventLocalities(response.data.response?.localities);
                setLoading(false);
            } else {
                setEvent(null);
                setEventLocalities(undefined);
                openModal(response.data.message)
                setLoading(false);
            }
        })
    }, []);
    function editLocalityElement(i: number, loc: FindEventLocalityDTO): import("react").ReactNode {
        return (
            <form className="" onSubmit={e => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const name = data.get("name")?.toString();
                const price = data.get("price")?.toString();
                const maxCapability = data.get("maxCapability")?.toString();
                if (name)
                    loc.name = name;
                console.log(price);

                if (price)
                    loc.price = Number(price);
                if (maxCapability)
                    loc.maxCapability = Number(maxCapability);
                closeModal();
            }}>
                <CardShadow>
                    <IconX className="self-end scale-110 hover:scale-125 transition-transform cursor-pointer" onClick={() => closeModal()} />
                    <label className="text-xl font-semibold">Edición de localidad</label>
                    <input name="name" defaultValue={loc.name} />
                    <input name="price" type="number" defaultValue={loc.price} />
                    <input name="maxCapability" type="number" defaultValue={loc.maxCapability} />
                    <div className="flex gap-2">

                        <button>Editar</button>
                    </div>
                </CardShadow>
            </form>)
    }


    return <>
        {!loading && !eventFound && <label>No fue encontrado</label>}
        {loading && <label>Cargando...</label>}

        {eventFound && (
            <div className="flex flex-col gap-2 p-2 items-center relative">
                <h1 className="text-white/50 text-2xl w-full">{"Edición de localidades"}</h1>
                <h1 className="font-bold text-white text-5xl">{eventFound.name}</h1>

                <div className="">

                    <label>Localidades</label>

                    <div className="grid grid-cols-5 w-full bg-black/5 border-2 border-white/10 rounded-md">

                        <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconTextCaption />{"Nombre"}</div>
                        <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconCash />{"Precio"}</div>
                        <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconUser />{"Tickets vendidos"}</div>
                        <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconUsersGroup />{"Capacidad máxima"}</div>
                        <div className="flex gap-1 items-center justify-center px-2 bg-white/5"><IconEdit />{"Editar"}</div>
                        {
                            eventLocalities && eventLocalities.map((loc, i) => {

                                return (
                                    <div key={i} className="grid grid-cols-5 w-full col-span-5 content-center py-1"
                                        style={{ background: i % 2 == 0 ? "transparent" : "#ffffff0a" }}>
                                        <label className="text-center items-center">{loc.name}</label>
                                        <label>{loc.price}</label>
                                        <label>{loc.ticketsSold}</label>
                                        <label>{loc.maxCapability}</label>
                                        <div className="w-full flex justify-center">
                                            <button type="button" className="button-icon"
                                                onClick={() => {
                                                    openCustomModal(editLocalityElement(i, loc))
                                                }}
                                            ><IconEdit /></button>
                                        </div>
                                    </div>)
                            })
                        }
                        <div className="px-8 py-2 w-full col-span-5">
                            <button className="button-secondary w-full"
                                onClick={() => {
                                    eventLocalities?.push({ id: "", maxCapability: 0, name: "", price: 0, ticketsSold: 0 })
                                    console.log(eventLocalities);
                                    setEventLocalities(JSON.parse(JSON.stringify(eventLocalities)))
                                }}
                            >Agregar</button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="button" className="button-secondary" onClick={() => router.back()}>Volver</button>
                    <button type="submit" onClick={() => {
                        handleSubmit();
                    }}>{buttonLoading ? <IconLoader className="w-full animate-spin text-black/50" /> : "Editar localidades"}</button>
                </div>
            </div>
        )}
    </>
}


export default EventPage;
