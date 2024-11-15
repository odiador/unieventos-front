"use client";
import { findCalendarOnly } from "@/api/utils/api";
import { CalendarOnlyDTO } from "@/api/utils/schemas";
import EventsPageFiltering from "@/components/eventFiltering";
import Image from "next/image";
import { useEffect, useState } from "react";

const EventPage = ({ params }: { params: { id: string } }) => {

    const [calendar, setCalendar] = useState<CalendarOnlyDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("No fue encontrado");
    useEffect(() => {
        findCalendarOnly(params.id).then((response) => {
            setMsg(response.data.message);
            if (response.status == 200) {
                setCalendar(response.data.response);
                setLoading(false);
            } else {
                setCalendar(null);
                setLoading(false);
            }
        });
    }, [])


    return <>
        {!loading && !calendar && <label>{"error: " + msg}</label>}
        {loading && <label>Cargando...</label>}
        {!loading && calendar && (
            <div className="flex flex-col w-full h-full justify-start items-start">
                <div className="flex flex-col w-full px-2 gap-8">
                    <Image width={1024} height={1024} className="w-full h-40 rounded-lg" src={calendar.bannerImage} alt={"Calendar banner"} />
                    <div className="flex sm:flex-row flex-col gap-1 sm:gap-4">
                        <h1 className="sm:hidden block text-3xl w-full font-extrabold sticky">{calendar.name}</h1>
                        <Image width={1024} height={1024} className="w-96 h-fit rounded-lg" src={calendar.image} alt={"Calendar banner"} />
                        <div className="flex flex-col flex-1 gap-2 h-full">
                            <h1 className="sm:block hidden h-full text-3xl w-full font-extrabold">{calendar.name}</h1>
                            <p>{calendar.description}</p>
                            {calendar.tags && <div className="flex gap-1 flex-wrap self-end justify-self-end">
                                {
                                    calendar.tags.map((tag) => {
                                        return <label key={"calendartag-" + tag.name} className="rounded-full text-sm px-2 py-0.5" style={{
                                            background: tag.color,
                                            color: tag.textColor
                                        }}>
                                            {tag.name}
                                        </label>
                                    })
                                }
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <EventsPageFiltering calendarId={params.id} />
            </div>
        )}

    </>
}


export default EventPage;
