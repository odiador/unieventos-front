"use client";
import { findEvent } from "@/api/utils/api";
import { FindEventDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import Image from "next/image";
import { useEffect, useState } from "react";

const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { openModal } = useModal();
    const [evtImage, setEventImage] = useState<string | null>(null);
    useEffect(() => {
        console.log(params);

        findEvent({ idCalendar: params.id, name: decodeURIComponent(params.eventid) }).then((response) => {
            if (response.status == 200) {
                setEvent(response.data.response);
                setEventImage(response.data.response?.eventImage || null)
                setLoading(false);
            } else {
                setEvent(null);
                openModal(response.data.message)
                setLoading(false);
            }
        })
    }, []);
    return <>
        {!loading && !eventFound && <label>No fue encontrado</label>}
        {loading && <label>Cargando...</label>}
        {!loading && eventFound && (
            <div className="flex flex-col gap-2 p-8">
                <input className="border-0 bg-transparent font-bold caret- text-white text-5xl" placeholder="Nombre del Evento" defaultValue={eventFound.name} />
                {evtImage && (<Image src={evtImage} width={1024} height={1024} className="w-40 h-fit" alt={evtImage} />)}
                <input type="file" />
                <input type="file" />
            </div>
        )}
    </>
}


export default EventPage;
