'use client';

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className="sm:pr-28 m-2 pb-16 relative flex gap-2 flex-col">
            <h2 className="text-2xl mb-2 font-bold">{"Página no encontrada"}</h2>
            <p>{"Amatickets no conoce esta página ¯\\_(ツ)_/¯"}</p>
            <button onClick={() => router.back()}>Volver</button>
        </div>
    </div>
};