"use client";
import { findEvent } from "@/api/utils/api";
import { EventTagDTO, eventTypes, FindEventDTO } from "@/api/utils/schemas";
import DropZone from "@/components/dropzone";
import { useModal } from "@/components/modal";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { FormEvent, useEffect, useState } from "react";


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
/**
 * 
 * interface FindEventDTO {
    name: string,
    eventImage: string,
    localityImage: string,
    city: string,
    description: string,
    address: string,
    startTime: string,
    endTime: string
    localities: FindEventLocalityDTO[],
    tags: EventTagDTO[],
    status: string,
    type: string
}

 * @param param0 
 * @returns 
 */
const EventPage = ({ params }: { params: { id: string, eventid: string } }) => {
    const [eventFound, setEvent] = useState<FindEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { openModal, openCustomModal, closeModal } = useModal();
    const [evtImage, setEventImage] = useState<string | undefined>(undefined);
    const [locImage, setLocImage] = useState<string | undefined>(undefined);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formdata = new FormData(e.currentTarget);
        const name = formdata.get("name")?.toString();
        const eventImage = evtImage === process.env.NEXT_PUBLIC_DEFAULT_IMAGE ? null : evtImage;
        const localityImage = locImage === process.env.NEXT_PUBLIC_DEFAULT_IMAGE ? null : locImage;
        const city = formdata.get("city")?.toString();
        const description = formdata.get("description")?.toString();
        const address = formdata.get("address")?.toString();
        const tags = eventFound?.tags;
        const eventType = formdata.get("eventType")?.toString();
        const startTime = formdata.get("startTime")?.toString();
        const endTime = formdata.get("endTime")?.toString();
        const status = formdata.get("status")?.toString();

        const newEvent = { name, eventImage, localityImage, city, description, address, tags, type: eventType, startTime, endTime, localities: [], status } as FindEventDTO;
        alert(JSON.stringify(newEvent));

        setLoading(false);

    }

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

    function editTagElement(tag: EventTagDTO, eventFound: FindEventDTO) {
        const filtered = eventFound.tags.filter(each => each.name !== tag.name);
        return <div className="bg-[#292e34] px-4 py-2 border-2 border-white/5 rounded-lg flex flex-col">
            <div className="flex justify-between text-2xl gap-8 items-center sm:col-span-2">
                {"Edición de Etiqueta"}
                <IconX className="cursor-pointer" onClick={() => {
                    if (tag.name === "") eventFound.tags = eventFound.tags.filter(each => each.name !== "");
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
                    eventFound.tags = eventFound.tags.filter(each => each.name !== tag.name);
                }}>Eliminar</button>
            </div>
        </div>;
    }


    return <>
        {!loading && !eventFound && <label>No fue encontrado</label>}
        {loading && <label>Cargando...</label>}

        {!loading && eventFound && (
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
                    <label>Etiquetas</label>
                    <div className="flex gap-1 w-full flex-wrap self-end">
                        {eventFound.tags.map((tag) => {
                            return (
                                <label key={tag.name} className="rounded-full text-sm px-4 py-0.5 flex gap-2 items-center" style={{
                                    background: tag.color,
                                    color: tag.textColor
                                }}>
                                    {tag.name}
                                    <IconEdit className="cursor-pointer transition-colors" style={{
                                        fill: tag.color,
                                    }} onClick={() => {
                                        openCustomModal(editTagElement(tag, eventFound))
                                    }} />
                                </label>
                            );
                        })}
                        <label className="rounded-full text-sm px-4 py-0.5 flex gap-2 items-center bg-white/10 text-white" >
                            {"Agregar"}
                            <IconPlus className="cursor-pointer transition-colors " onClick={() => {
                                const tag = { name: "", color: "#000000", textColor: "#ffffff" }
                                eventFound.tags.push(tag);
                                openCustomModal(editTagElement(tag, eventFound))
                            }} />
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <label>Localidades</label>
                    {/* LOCALIDADES */}
                </div>
                <div className="flex gap-2">
                    <label></label>
                    <select name="eventType">
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
                <button type="submit">Submit</button>
            </form>
        )}
    </>
}


export default EventPage;
