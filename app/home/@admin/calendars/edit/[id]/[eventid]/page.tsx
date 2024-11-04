"use client";
import { editEvent, findEvent } from "@/api/utils/api";
import { BadRequestFieldsDTO, EditEventDTO, EventTagDTO, eventTypes, FindEventDTO } from "@/api/utils/schemas";
import { getImageFromString } from "@/api/utils/util";
import DropZone from "@/components/dropzone";
import { useModal } from "@/components/modal";
import { IconEdit, IconLoader, IconPlus, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";


const defaultColors = [
    {
        name: "Selecciona un color",
        value: "",
        color: "#000000",
        textColor: "#ffffff"
    },
    {
        name: "Rosa",
        color: "#dc148c",
        textColor: "#ffffff"
    },
    {
        name: "Verde",
        color: "#006450",
        textColor: "#ffffff"
    }
    ,
    {
        name: "Morado",
        color: "#8400e7",
        textColor: "#ffffff"
    }, {
        name: "Azul Oscuro",
        color: "#1e3264",
        textColor: "#ffffff"
    }, {
        name: "Verde Oscuro",
        color: "#608108",
        textColor: "#ffffff"
    }, {
        name: "Rojo",
        color: "#e61e32",
        textColor: "#ffffff"
    }, {
        name: "Azul",
        color: "#0d73ec",
        textColor: "#ffffff"
    }, {
        name: "Naranja",
        color: "#e13300",
        textColor: "#ffffff"
    }
]
const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [eventTags, setEventTags] = useState<EventTagDTO[] | undefined>();
    const { openModal, openCustomModal, closeModal } = useModal();
    const [evtImage, setEventImage] = useState<string | undefined>(undefined);
    const [locImage, setLocImage] = useState<string | undefined>(undefined);
    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!buttonLoading) {
            setButtonLoading(true);
            const formdata = new FormData(e.currentTarget);

            const formStartTime = new Date(formdata.get("startTime")?.toString() || "");
            const eventStartTime = new Date(eventFound?.startTime || "");

            const formEndTime = new Date(formdata.get("endTime")?.toString() || "");
            const eventEndTime = new Date(eventFound?.endTime || "");

            const name = eventFound?.name;
            const newName = formdata.get("name")?.toString();
            const eventImage = (evtImage === null || evtImage === process.env.NEXT_PUBLIC_DEFAULT_IMAGE || evtImage === eventFound?.eventImage) ? undefined : await getImageFromString(evtImage || "");
            const localityImage = (locImage === null || locImage === process.env.NEXT_PUBLIC_DEFAULT_IMAGE || locImage === eventFound?.localityImage) ? undefined : await getImageFromString(locImage || "");
            const city = formdata.get("city")?.toString();
            const description = formdata.get("description")?.toString();
            const address = formdata.get("address")?.toString();
            const tags = eventTags;
            const eventType = formdata.get("eventType")?.toString();

            const startTime = formStartTime.toString() === eventStartTime.toString() ? null : formStartTime.toISOString();
            const endTime = eventEndTime.toString() === formEndTime.toString() ? null : formEndTime.toISOString();
            const status = formdata.get("status")?.toString();
            const newEvent = { idCalendar: params.id, name, newName, eventImage: eventImage, localityImage, city, description, address, tags, type: eventType, startTime, endTime, status } as EditEventDTO;
            console.log(newEvent);
            const editedEvent = await editEvent(newEvent, getCookie("jwt") || "");
            console.log(editedEvent.data);

            if (editedEvent.status == 200) {
                if (newName && name !== newName) {
                    router.replace(`/dashboard/calendars/edit/${params.id}/${encodeURIComponent(newName)}`)
                }
            } else {
                const errorData = editedEvent.data as unknown as BadRequestFieldsDTO;
                openModal(JSON.stringify(errorData));
            }
            setButtonLoading(false);
        }
    }

    useEffect(() => {

        findEvent({ idCalendar: params.id, name: decodeURIComponent(params.eventid) }).then((response) => {
            if (response.status == 200) {
                setEvent(response.data.response);
                setEventTags(response.data.response?.tags);
                setLoading(false);
            } else {
                setEvent(null);
                setEventTags(undefined);
                openModal(response.data.message)
                setLoading(false);
            }
        })
    }, []);

    function editTagElement(tag: EventTagDTO, tags: EventTagDTO[], setTags: Dispatch<SetStateAction<EventTagDTO[] | undefined>>) {
        const filtered = tags.filter(each => each.name !== tag.name);
        return <div className="bg-[#292e34] px-4 py-2 border-2 border-white/5 rounded-lg flex flex-col">
            <div className="flex justify-between text-2xl gap-8 items-center sm:col-span-2">
                {"Edición de Etiqueta"}
                <IconX className="cursor-pointer" onClick={() => {
                    if (tag.name === "") setTags(tags.filter(each => each.name !== ""));
                    closeModal()
                }}></IconX>
            </div>
            <section className="sm:col-span-2">
                {"Vista Previa"}
                <label id="tag-edit" key={tag.name} className="relative w-fit rounded-full text-sm px-4 py-0.5 flex gap-2 items-center" style={{
                    background: tag.color,
                    color: tag.textColor
                }}>
                    {tag.name}
                </label>
            </section>

            <section>
                <label>Texto</label>
                <input defaultValue={tag.name} placeholder="Nombre" onChange={(e) => {
                    const tagEdit = document.getElementById("tag-edit");
                    if (tagEdit)
                        tagEdit.textContent = e.target.value;
                }} />
            </section>
            <label className="mt-4 validator-message" id="edit-tag-validator"></label>
            <hr className="h-px border-0 bg-white/10 sm:col-span-2 my-4" />
            <div className="grid sm:grid-cols-2">
                <label className="sm:col-span-2 text-xl">Colores</label>
                <label className="sm:col-span-2 text-white/70">Hazlo Manualmente</label>
                <section>
                    <label>Color de fondo</label>
                    <input onChange={(e) => {
                        const tagEdit = document.getElementById("tag-edit");
                        if (tagEdit)
                            tagEdit.style.background = e.target.value;
                    }} defaultValue={tag.color} id="tag-edit-color" className="col" placeholder="Color" type="color" />
                </section>
                <section>
                    <label>Color de texto</label>
                    <input onChange={(e) => {
                        const tagEdit = document.getElementById("tag-edit");
                        if (tagEdit)
                            tagEdit.style.color = e.target.value;
                    }} defaultValue={tag.textColor} id="tag-edit-text" className="col" placeholder="Color" type="color" />
                </section>
                <label className="sm:col-span-2 text-white/70">o usa plantillas existentes</label>
                <select className="bg-black text-white outline-none py-1 px-3.5 sm:col-span-2 rounded-md" onChange={(e) => {
                    const v = e.target.value;
                    const tagEdit = document.getElementById("tag-edit");
                    if (tagEdit) {
                        const col = defaultColors.filter(col => col.name === v)[0];
                        tagEdit.style.background = col.color;
                        e.target.style.background = col.color;
                        tagEdit.style.color = col.textColor;
                        e.target.style.color = col.textColor;
                    }
                }} id="combo-color">
                    {defaultColors.map((color) => {
                        return <option key={color.name} value={color.value || color.name} style={{ background: color.color }}>{color.name}</option>
                    })}
                </select>

            </div>
            <div className="flex gap-2 w-full mt-4 sm:col-span-2">
                <button type="button" className="flex-1" onClick={() => {
                    const tagEdit = document.getElementById("tag-edit");
                    const tagEditValidator = document.getElementById("edit-tag-validator");
                    if (tagEdit) {
                        const filteredtags = filtered.filter(each => each.name === tagEdit.textContent);
                        const content = (tagEdit.textContent || "").trim();

                        if (content.length == 0) {
                            if (tagEditValidator)
                                tagEditValidator.textContent = "El nombre de la etiqueta no puede estar vacío.";
                            return;
                        }
                        if (filteredtags.length > 0) {
                            if (tagEditValidator)
                                tagEditValidator.textContent = "Ya existe una etiqueta con este nombre.";
                            return;
                        }
                        tag.color = tagEdit.style.background;
                        tag.textColor = tagEdit.style.color;
                        tag.name = content;
                    }

                    closeModal();
                }}>Guardar</button>
                <button type="button" className="flex-1 button-secondary" onClick={() => {
                    closeModal();
                    setTags(tags.filter(each => each.name !== tag.name));
                }}>Eliminar</button>
            </div>
        </div>;
    }


    return <>
        {!loading && !eventFound && <label>No fue encontrado</label>}
        {loading && <label>Cargando...</label>}

        {eventFound && (
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 items-center relative" onSubmit={handleSubmit}>
                <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                    <input
                        name="name"
                        className="border-0 bg-transparent font-bold text-white text-5xl"
                        placeholder="Nombre del Evento"
                        defaultValue={eventFound.name} />
                    <IconEdit className="scale-150 cursor-pointer text-[#9ca3af] hover:text-white transition-colors" onClick={() => {
                    }} />
                </div>
                <section className="sm:col-span-2">
                    <label className="text-lg  font-semibold">Descripción</label>
                    <textarea
                        name="description"
                        defaultValue={eventFound.description}
                        placeholder="Descripción"
                    />
                </section>
                <section>
                    <label className="text-lg font-semibold">Ciudad</label>
                    <input
                        defaultValue={eventFound.city}
                        name="city"
                        type="text"
                        placeholder="Ciudad" />
                </section>

                <section>
                    <label className="text-lg font-semibold">Dirección</label>
                    <input
                        name="address"
                        defaultValue={eventFound.address}
                        placeholder="Dirección"
                    />
                </section>
                <section>
                    <label className="text-lg font-semibold">Hora de Inicio</label>
                    <input
                        defaultValue={eventFound.startTime}
                        name="startTime"
                        type="datetime-local"
                        placeholder="Hora de inicio" />
                </section>
                <section>
                    <label className="text-lg font-semibold">Hora de fin</label>
                    <input
                        defaultValue={eventFound.endTime}
                        name="endTime"
                        type="datetime-local"
                        placeholder="Hora de fin" />
                </section>
                <div className="flex flex-col gap-2 sm:col-span-2 ">
                    <label>{eventTags ? "Etiquetas" : "No hay etitquetas"}</label>
                    {eventTags && <div className="flex gap-1 w-full flex-wrap self-end">
                        {eventTags.map((tag) => {
                            return (
                                <label key={tag.name} className="rounded-full text-sm px-4 py-0.5 flex gap-2 items-center" style={{
                                    background: tag.color,
                                    color: tag.textColor
                                }}>
                                    {tag.name}
                                    <IconEdit className="cursor-pointer transition-colors" style={{
                                        fill: tag.color,
                                    }} onClick={() => {
                                        openCustomModal(editTagElement(tag, eventTags, setEventTags))
                                    }} />
                                </label>
                            );
                        })}
                        <label className="rounded-full text-sm px-4 py-0.5 flex gap-2 items-center bg-white/10 text-white" >
                            {"Agregar"}
                            <IconPlus className="cursor-pointer transition-colors " onClick={() => {
                                const tag = { name: "", color: "#000000", textColor: "#ffffff" }
                                eventTags.push(tag);
                                setEventTags(eventTags)
                                openCustomModal(editTagElement(tag, eventTags, setEventTags))
                            }} />
                        </label>
                    </div>}
                </div>
                <div className="flex gap-2">
                    <label>Localidades</label>
                    {JSON.stringify(eventFound.localities)}
                </div>
                <div className="flex gap-2">
                    <select name="eventType" defaultValue={eventFound.type}>
                        {eventTypes.map(type => <option key={type}>{type}</option>)}
                    </select>
                    <select name="status">
                        <option>ACTIVE</option>
                        <option>INATIVE</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <label>Imagen del Evento</label>
                    <DropZone aspect={1} croppedImage={evtImage} setImageCropped={setEventImage} initialImage={eventFound.eventImage} />
                </div>
                <div className="flex gap-2">
                    <label>Imagen de la Localidad</label>
                    <DropZone aspect={1} croppedImage={locImage} setImageCropped={setLocImage} initialImage={eventFound.localityImage} />
                </div>
                <button type="submit">{buttonLoading ? <IconLoader className="w-full animate-spin text-black/50" /> : "Editar evento"}</button>
                <button type="button" className="button-secondary" onClick={() => router.back()}>Cancelar</button>
            </form>
        )}
    </>
}


export default EventPage;
