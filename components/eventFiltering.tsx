"use client";

import { findEventsFilter } from "@/api/utils/api";
import { BadRequestFieldsDTO, FindEventDTO } from "@/api/utils/schemas";
import { formatTime } from "@/api/utils/util";
import { IconArrowLeft, IconArrowRight, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useModal } from "./modal";

const EventsPageFiltering = ({ calendarId }: { calendarId?: string }) => {

    const [events, setEvents] = useState<FindEventDTO[] | null>(null);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [filtersShowing, setFiltersShowing] = useState(false);
    const searchParams = useSearchParams();

    const pg = searchParams.get("page");
    const sz = searchParams.get("size");

    const [page, setPage] = useState<number>(Number.parseInt(pg || "0"));
    const [size, setSize] = useState<number>(Number.parseInt(sz || "2"));
    const [sizeValidator, setSizeValidator] = useState<string>();
    const [city, setCity] = useState<string>();
    const [cityValidator, setCityValidator] = useState<string>();
    const [tag, setTag] = useState<string>();
    const [tagValidator, setTagValidator] = useState<string>();
    const [name, setName] = useState<string>();
    const [nameValidator, setNameValidator] = useState<string>();
    const [date, setDate] = useState<string>();
    const [dateValidator, setDateValidator] = useState<string>();
    const { openModal } = useModal();
    function updateEvents() {
        setEventsLoading(true);
        const data = { size, page } as { id?: string, size: number, page: number, city?: string, tagName?: string, date?: string, name?: string };
        if (calendarId)
            data.id = calendarId;
        if (tag && tag !== "") data.tagName = tag;
        if (city && city !== "") data.city = city;
        if (date && date !== "") data.date = date;
        if (name && name !== "") data.name = name;
        findEventsFilter(data).then((response) => {
            if (response.status == 200) {
                setEvents(response.data.response);
            } else if (response.status == 400) {
                const data = response.data as unknown as BadRequestFieldsDTO;
                data.errors.forEach(value => {
                    if (value.field == "size") setSizeValidator(value.message);
                    else if (value.field == "name") setNameValidator(value.message);
                    else if (value.field == "city") setCityValidator(value.message);
                    else if (value.field == "tagName") setTagValidator(value.message);
                    else if (value.field == "date") setDateValidator(value.message);
                })
                openModal(JSON.stringify(data));
                setEvents(null);
            } else {
                openModal(response.data.message);
                setEvents(null);
            }
            setEventsLoading(false);
        })
    }
    useEffect(() => {
        updateEvents();
    }, []);
    return <div className="w-full flex flex-col items-center gap-1">
        <h2 className="text-3xl font-bold text-center w-full mt-20">{calendarId ? "Eventos del Calendario" : "Eventos"}</h2>
        <div className="flex mt-4 justify-center gap-2 w-full">
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
            <button onClick={() => updateEvents()}>Cambiar</button>
            <button className="button-icon"
                onClick={() => {
                    setPage((pg) => pg + 1);
                }}>
                <IconArrowRight />
            </button>
        </div>
        <form className="w-full bg-white/10 rounded-md max-w-5xl px-4 pb-4 flex flex-col"
            onSubmit={e => {
                e.preventDefault();
                updateEvents();
            }}
        >
            <div className="flex items-center py-2 justify-between cursor-pointer" onClick={() => setFiltersShowing(p => !p)}>
                <label className="text-2xl font-bold">Filtros</label>
                <div className="scale-110">
                    {
                        filtersShowing ?
                            <IconChevronUp /> :
                            <IconChevronDown />
                    }
                </div>
            </div>
            {filtersShowing && <>
                <div className="flex items-center justify-center gap-2">
                    <label className="text-nowrap">Tamaño de la página</label>
                    <input type="number"
                        value={size}
                        onChange={e => setSize(Number(e.target.value))}
                        placeholder="Tamaño" />
                </div>
                {sizeValidator && <label className="validator-message mt-2">{sizeValidator}</label>}
                <div className="flex items-center justify-center gap-2">
                    <label className="text-nowrap">Nombre de evento</label>
                    <input type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nombre" />
                </div>
                {nameValidator && <label className="validator-message mt-2">{nameValidator}</label>}
                <div className="flex items-center justify-center gap-2">
                    <label className="text-nowrap">Ciudad de evento</label>
                    <input type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Ciudad" />
                </div>
                {cityValidator && <label className="validator-message mt-2">{cityValidator}</label>}
                <div className="flex items-center justify-center gap-2">
                    <label className="text-nowrap">Etiqueta de evento</label>
                    <input type="text"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        placeholder="Etiqueta" />
                </div>
                {tagValidator && <label className="validator-message mt-2">{tagValidator}</label>}
                <div className="flex items-center justify-center gap-2">
                    <label className="text-nowrap">Fecha:</label>
                    <input type="datetime-local"
                        value={date}
                        name="date"
                        onChange={e => setDate(e.target.value)}
                        placeholder="Fecha" />
                </div>
                {dateValidator && <label className="validator-message mt-2">{dateValidator}</label>}
                <div className="flex gap-2 w-full justify-end items-center mt-4">
                    <button type="button" className="button-terciary w-fit"
                        onClick={() => {
                            setCity("");
                            setDate("");
                            setName("");
                            setTag("");
                            updateEvents();
                        }}
                    >Eliminar filtros</button>
                    <button type="submit" className="w-fit">Filtrar</button>
                </div>
            </>}
        </form>
        {eventsLoading && generateEventsLoader(size)}
        {!eventsLoading && events && (
            <div className="flex flex-col gap-4 p-4 w-full justify-start h-fit items-center">
                {getEvents(events, calendarId)}
            </div>
        )}
    </div>
}
function generateEventsLoader(size: number) {
    const sizeArr = new Array(size).fill(null);
    const tagArr = new Array(3).fill(null);
    return (
        <div className="flex flex-col gap-4 p-4 w-full justify-start h-fit items-center">
            {
                sizeArr.map((v, i) => {
                    return <div className="w-full min-h-40 max-w-5xl flex sm:flex-row hover:scale-105 transition-transform flex-col bg-white/5 rounded-lg p-4 gap-2" key={i}>
                        <div className="flex flex-1 flex-col pointer-events-none animate-pulse gap-2">
                            <div className="text-white/50 flex gap-2 h-4 w-24 bg-white/20 rounded-full mb-3"></div>
                            <label className="font-bold w-28 h-7 bg-white/20 rounded-full"></label>
                            <div className="block sm:hidden size-24 rounded-lg bg-white/30"></div>
                            <label className="w-full h-12 bg-white/20 rounded-full" />
                            <div className="flex-1 flex items-end">
                                <div className="flex gap-1 w-full flex-wrap self-end">
                                    {tagArr.map((v, index) => {
                                        return (
                                            <label key={"tag" + index}
                                                style={{ width: (index + 3) * 16 }}
                                                className="rounded-full text-sm px-2 py-0.5 h-6 bg-white/10 text-white" />
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                        <div className="sm:block hidden size-24 rounded-lg bg-white/30 animate-pulse"></div>
                    </div>
                })
            }
        </div>)
}

function getEvents(events: FindEventDTO[], calendarId?: string) {
    return events.map(c => {
        const startTime = new Date(c.startTime);
        const endTime = new Date(c.endTime);
        const startDate = startTime.toLocaleDateString();
        const endDate = endTime.toLocaleDateString();
        const tags = c.tags;
        return (
            <Link href={`/home/calendars/${encodeURIComponent(c.calendarId)}/event/${encodeURIComponent(c.id)}`} className="w-full min-h-40 max-w-5xl flex sm:flex-row hover:scale-105 transition-transform flex-col bg-white/5 rounded-lg p-4 gap-2" key={c.name}>
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


export default EventsPageFiltering;