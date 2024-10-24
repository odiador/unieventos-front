"use client";
import { findEvent } from "@/api/utils/api";
import { FindEventDTO } from "@/api/utils/schemas";
import { useModal } from "@/components/modal";
import { useEffect, useState } from "react";

const EditEventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { openModal } = useModal();
    useEffect(() => {
        console.log(params);
        
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
        {loading && <label>Cargando</label>}
        {!loading && eventFound && <label>{JSON.stringify(eventFound)}</label>}
    </>
}

export default EditEventPage;
