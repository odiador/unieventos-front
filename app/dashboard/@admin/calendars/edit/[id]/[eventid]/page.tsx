"use client";
import { findEvent } from "@/api/utils/api";
import { FindEventDTO } from "@/api/utils/schemas";
import DropZone from "@/components/dropzone";
import { useModal } from "@/components/modal";
import { IconEdit } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { openModal } = useModal();
    const [evtImage, setEventImage] = useState<string | undefined>(undefined);
    useEffect(() => {

        findEvent({ idCalendar: params.id, name: decodeURIComponent(params.eventid) }).then((response) => {
            if (response.status == 200) {
                setEvent(response.data.response);
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
            <div className="flex flex-col gap-2 p-8 items-center relative">
                <div className="flex items-center">
                    <input className="border-0 bg-transparent font-bold text-white text-5xl" placeholder="Nombre del Evento" defaultValue={eventFound.name} />
                    <IconEdit className="scale-150 cursor-pointer text-[#9ca3af] hover:text-white transition-colors" onClick={() => {

                    }} />
                </div>
                <div className="px-8 py-2 bg-white bg-opacity-[.02]">
                    <DropZone aspect={1} croppedImage={evtImage} setImageCropped={setEventImage} initialImage={eventFound.eventImage} />
                </div>
                {evtImage && (<Image src={evtImage} width={1024} height={1024} className="w-40 h-fit" alt={evtImage} />)}
                <input type="file" />
            </div>
        )}
    </>
}


export default EventPage;
