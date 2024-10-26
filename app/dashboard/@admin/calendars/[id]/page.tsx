"use client";
import { findEvent, findCalendarOnly, findEvents } from "@/api/utils/api";
import { CalendarDTO, CalendarOnlyDTO, FindEventDTO } from "@/api/utils/schemas";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = ({ params }: { params: { id: string } }) => {

    const [calendar, setCalendar] = useState<CalendarOnlyDTO | null>(null);
    const [events, setEvents] = useState<FindEventDTO[] | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const pg = searchParams.get("page");
    const sz = searchParams.get("size");

    const [page, setPage] = useState<number>(Number.parseInt(pg || "0"));
    const [size, setSize] = useState<number>(Number.parseInt(sz || "2"));
    const [msg, setMsg] = useState("No fue encontrado");
    const router = useRouter();



    function updateEvents() {
        findEvents({ id: params.id, page, size }).then((response) => {
            setMsg(response.data.message);
            if (response.status == 200) {
                setEvents(response.data.response);
                setLoading(false);
            } else {
                console.log(response);
                setEvents(null);
                setLoading(false);
            }
        })
    }
    useEffect(() => {
        findCalendarOnly(params.id).then((response) => {
            setMsg(response.data.message);
            if (response.status == 200) {
                setCalendar(response.data.response);
                setLoading(false);
            } else {
                console.log(response);
                setCalendar(null);
                setLoading(false);
            }
        }).catch(e => console.log(e));
    }, [])

    useEffect(() => {
        console.log({ page, size });
        updateEvents();
    }, [page, size]);

    return <>
        {!loading && !calendar && <label>{msg + "hola"}</label>}
        {loading && <label>Cargando...</label>}
        {!loading && calendar && (
            <div className="flex flex-col w-full h-full justify-start items-start">
                <div className="flex flex-col w-full px-2 gap-8">
                    <Image width={1024} height={1024} className="w-full h-40 rounded-lg" src={calendar.bannerImage} alt={"Calendar banner"} />
                    <div className="flex sm:flex-row flex-col gap-1 sm:gap-4">
                        <h1 className="sm:hidden block text-3xl w-full font-extrabold sticky">{calendar.name}</h1>
                        <Image width={1024} height={1024} className="w-96 h-fit rounded-lg" src={calendar.image} alt={"Calendar banner"} />
                        <div className="flex flex-col flex-1 gap-2">
                            <h1 className="sm:block hidden text-3xl w-full font-extrabold sticky">{calendar.name}</h1>
                            <p>{calendar.description}</p>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center w-full mt-20">{"Eventos del Calendario"}</h2>
                <div className="flex mt-4 justify-center gap-2 w-full">
                    <button className="button-icon" onClick={() => {
                        let n = page;
                        if (n > 0)
                            n = n - 1;
                        setPage(n);
                    }}>
                        <IconArrowLeft />
                    </button>
                    <button className="button-icon"
                        onClick={() => {
                            setPage((pg) => pg + 1);
                        }}>
                        <IconArrowRight />
                    </button>
                </div>
                {events && (
                    <div className="flex flex-col gap-4 p-8 w-full justify-start h-full items-center">
                        {getEvents(events, params.id)}
                    </div>
                )}
            </div>
        )}

    </>
}

function getEvents(events: FindEventDTO[], id: string) {
    return events.map(c => {
        const startTime = new Date(c.startTime);
        const endTime = new Date(c.endTime);
        const startDate = startTime.toLocaleDateString();
        const endDate = endTime.toLocaleDateString();
        const tags = c.tags;
        return (
            <Link href={`/dashboard/calendars/edit/${encodeURIComponent(id)}/${encodeURIComponent(c.name)}`} className="w-full min-h-40 max-w-5xl flex sm:flex-row hover:scale-105 transition-transform flex-col bg-white/5 rounded-lg p-4 gap-2" key={c.name}>
                <div className="flex flex-1 flex-col pointer-events-none">
                    <div className="text-white/50 flex gap-2">
                        {startDate === endDate ?
                            <>
                                <label>{startDate}</label>
                                <label>{`${formatTime(startTime)} - ${formatTime(endTime)}`}</label>
                            </> :
                            `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`}
                    </div>
                    <label className="text-3xl font-bold">{c.name}</label>
                    {c.eventImage ? <Image width={1024} height={1024} className="block sm:hidden h-24 w-fit rounded-lg" src={c.eventImage} alt={`image of ${c.eventImage}`} /> : <label>{"No hay imagen"}</label>}
                    <label>{c.description}</label>
                    <div className="flex-1 flex items-end">
                        <div className="flex gap-1 w-full flex-wrap self-end">
                            {tags.map(tag => {
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
                {c.eventImage ? <Image width={1024} height={1024} className="sm:block pointer-events-none hidden h-24 w-fit rounded-lg" src={c.eventImage} alt={`image of ${c.eventImage}`} /> : <label>{"No hay imagen"}</label>}
            </Link>
        );
    });
}

/**
 * 
 * @param num 
 * @returns 
 */
function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

function formatTime(date: Date) {
    return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
}


export default EventPage;
