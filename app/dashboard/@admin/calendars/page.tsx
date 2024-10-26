"use client";
import { listCalendars } from "@/api/utils/api";
import { CalendarOnlyDTO } from "@/api/utils/schemas";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {

    const [calendars, setCalendars] = useState<CalendarOnlyDTO[] | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const pg = searchParams.get("page");
    const sz = searchParams.get("size");

    const [page, setPage] = useState<number>(Number.parseInt(pg || "0"));
    const [size, setSize] = useState<number>(Number.parseInt(sz || "2"));
    const [msg, setMsg] = useState("No fue encontrado");
    const router = useRouter();

    function updateCalendars() {
        const data = { page, size };
        listCalendars(data).then((response) => {
            setMsg(response.data.message);
            if (response.status == 200) {
                setCalendars(response.data.response);
                setLoading(false);
            } else {
                setCalendars(null);
                setLoading(false);
            }
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        updateCalendars();
    }, [page, size]);

    return <>
        {!loading && !calendars && <label>{msg + "hola"}</label>}
        {loading && <label>Cargando...</label>}
        {!loading && calendars && (
            <div className="flex flex-col gap-2 p-8 w-full justify-start h-full">
                <div className="flex justify-center gap-2">
                    <button onClick={() => {
                        let n = page;
                        if (n > 0)
                            n = n - 1;
                        setPage(n);
                    }}
                    className="button-icon"
                    >
                        <IconArrowLeft/>
                    </button>
                    <button onClick={() => {
                        setPage((pg) => pg + 1);
                    }}
                    className="button-icon"
                    >
                        <IconArrowRight/>
                    </button>
                </div>
                <div className="flex flex-col gap-2 ">
                    {
                        calendars.map(c => {
                            return (
                                <Link href={`/dashboard/calendars/${c.id}`} className="w-full flex bg-white/5 rounded-lg p-4" key={c.id}>
                                    <div className="flex flex-1 flex-col gap-4">
                                        <label className="text-2xl font-bold">{c.name}</label>
                                        <label className="w-3/4">{c.description}</label>
                                        <button className="w-fit button-secondary">Ver más <IconArrowRight /></button>
                                    </div>
                                    {c.image ? <Image width={1024} height={1024} className="h-24 w-fit rounded-lg" src={c.image} alt={`image of ${c.image}`} /> : <label>{"No hay imagen"}</label>}
                                </Link>
                            )
                        })
                    }
                </div>

            </div>
        )}
    </>
}


export default EventPage;
