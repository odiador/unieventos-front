'use client';

import { IconTicket } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFound() {
    return <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className=" sm:pr-28 m-2 pb-16 relative flex flex-col">
            <h2 className="text-2xl mb-2 font-bold">{"Página no encontrada"}</h2>
            <p className="pr-4">{"Mientras la encuentras, puedes ver nuevos calendarios aquí"}</p>
            <Link href={"/home/events"} className="absolute right-0 bottom-0 place-self-end button button-icon" ><IconTicket /></Link>
        </div>
    </div>
};