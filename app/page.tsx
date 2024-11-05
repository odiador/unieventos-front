"use client";

import { listCalendars } from "@/api/utils/api";
import { CalendarOnlyDTO } from "@/api/utils/schemas";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {
  const [calendarPage, setCalendarPage] = useState<number>(0);
  const [calendar, setCalendar] = useState<CalendarOnlyDTO | undefined>();
  const [calendarLoading, setCalendarLoading] = useState(true);
  const template = {
    tags: new Array(3).fill(null)
  };
  useEffect(() => {
    listCalendars({ page: calendarPage, size: 1 }).then((response) => {
      setCalendarLoading(true);
      if (response.status == 200 && response.data.response) {
        const cal = response.data.response as unknown as CalendarOnlyDTO[];
        if (cal.length > 0)
          setCalendar(cal[0]);
        else if (calendarPage != 0)
          setCalendarPage(0);
      } else {
        setCalendar(undefined);
      }
      setCalendarLoading(false);

    }).catch(e => console.error(e))
  }, [calendarPage])
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='relative flex items-center justify-top flex-col py-2 h-full text-xl'>
      <section
        className="p-2 sm:w-2/3  pb-16 flex flex-col gap-4 font-semibold">
        <label className="mt-10 bg-gradient-to-r from-[#AA9CFF] via-[#EC9FFF] to-[#FFABB9] bg-clip-text text-transparent font-extrabold text-6xl">{"amaTickets"}</label>
        <p className="lg:w-3/4">Descubre eventos únicos, encuentra el lugar perfecto y asegura tu entrada en un solo clic. Con AmaTickets, cada experiencia está al alcance de tus manos.</p>
      </section>
      <section className="p-2 sm:w-2/3 h-fit relative w-full flex flex-col gap-4 mb-20">
        <label className="font-extrabold text-3xl">Descubre <strong className="bg-gradient-to-r from-[#AA9CFF] via-[#EC9FFF] to-[#FFABB9] bg-clip-text text-transparent font-extrabold text-3xl">Calendarios</strong></label>
        <p className="lg:w-3/4">Explora los calendarios de eventos que más te interesan y mantente al tanto de las experiencias que no querrás perderte.</p>
        <Link href={"/home/calendars"} className="button self-end"><div className="flex items-center justify-center gap-">Ver todos <IconArrowRight /></div></Link>
      </section>
      <section className="p-2 sm:w-1/2 h-fit relative w-full flex flex-col gap-4">
        <div className="flex w-full justify-center items-center gap-4">
          <button type="button" className="button-icon" onClick={() => setCalendarPage(prev => {
            if (prev == 0) return 0
            return prev - 1
          })}><IconArrowLeft /></button>
          {
            !calendarLoading && calendar && (
              <Link href={`/home/calendars/${calendar.id}`} className="relative p-2 w-full items-stretch h-fit bg-black/10 border-white/5 rounded-lg border-2 flex sm:flex-row flex-col gap-2 hover:scale-[1.01] transition-transform cursor-pointer">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-extrabold text-2xl bg-gradient-to-r from-[#AA9CFF] via-[#EC9FFF] to-[#FFABB9] bg-clip-text text-transparent">{calendar.name}</label>
                  <Image src={calendar.image} alt="calendarImg" className="block self-center sm:hidden size-32 sm:size-40 rounded-md" width={1024} height={1024} />
                  <p className="font-light text-base w-full flex-1 h-full">{calendar.description}</p>
                  <div className="flex-wrap self-end h-fit flex gap-1">
                    {calendar.tags.map(tag => {
                      return (
                        <label key={tag.name} className="rounded-full w-fit text-sm px-2 py-0.5" style={{
                          background: tag.color,
                          color: tag.textColor
                        }}>
                          {tag.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <Image src={calendar.image} alt="calendarImg" className="hidden sm:block size-32 sm:size-40 rounded-md" width={1024} height={1024} />
              </Link>
            )
          }
          {
            !calendarLoading && !calendar && (
              <div className="relative p-2 w-full justify-center items-center h-44 bg-black/10 border-white/5 rounded-lg border-2 flex" >
                {"No se puede obtener calendarios, inténtalo de nuevo más tarde :("}
              </div>
            )
          }
          {
            calendarLoading && (
              <div className="relative p-2 w-full items-center bg-black/10 border-white/5 rounded-lg border-2 flex sm:flex-row flex-col gap-2">
                <div className="flex flex-col gap-2 w-full flex-1 animate-pulse">
                  <label className="font-extrabold text-2xl bg-gradient-to-r from-[#AA9CFF40] via-[#EC9FFF40] to-[#FFABB940] rounded-full w-32 bg-white/10 h-6" />
                  <div className="block self-center sm:hidden size-32 sm:size-40 rounded-md bg-white/10" />
                  <div className="font-light text-base h-20 w-full rounded-md bg-white/10" />
                  <div className="flex-wrap self-end flex gap-1">
                    {template.tags.map((tag, i) => {
                      return (
                        <label key={"tag" + i} className="rounded-full h-4 text-sm px-2 py-0.5 bg-white/10 text-white" style={{
                          width: 16 * (i * 2 + 2)
                        }} />
                      );
                    })}
                  </div>
                </div>
                <div className="hidden sm:block size-32 sm:size-40 rounded-md bg-white/10 animate-pulse" />

              </div>
            )
          }
          <button type="button" className="button-icon" onClick={() => {
            setCalendarLoading(true)
            setCalendarPage(prev => prev + 1)
          }
          }><IconArrowRight /></button>
        </div>
      </section>
    </motion.div >
  );
}
