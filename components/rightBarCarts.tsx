"use client";

import { addItemToCart, createCart, findAllCarts, findCart, findEvent, removeItemToCart } from "@/api/utils/api";
import { BadRequestFieldsDTO, CartDetailDTO, CartDTO, ErrorDTO } from "@/api/utils/schemas";
import { IconEdit, IconEye, IconTrash, IconX } from "@tabler/icons-react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import CardShadow from "./cardshadow";



const openCartAction = (openRightBar: (content: ReactNode) => void, closeRightBar: () => void, closeable: boolean = true, setItems: Dispatch<SetStateAction<CartDetailDTO[] | undefined>>, items: CartDetailDTO[] | undefined, openCustomModal: (children: ReactNode) => void, closeModal: () => void, openModal: (content: string) => void) => {
    const cartId = getCookie("cart")
    const jwt = getCookie("jwt")

    const carritoSiSeleccionado = async () => {
        const id = getCookie("cart");
        const response = await findCart(id || "", jwt || "");
        console.log(response.status);
        if (response.status == 200) {
            const cart = response.data.response;
            if (cart) {
                setItems(cart.items);
                items = cart.items;
            }

            const removeItem = (item: CartDetailDTO) => {
                const cart = getCookie("cart") || "";
                removeItemToCart(
                    {
                        calendarId: item.calendarId,
                        cartId: cart,
                        eventName: item.eventName,
                        localityName: item.localityName
                    },
                    getCookie("jwt") || "").then((response) => {
                        if (response.status == 200) {
                            carritoSiSeleccionado().then(t => {
                                openRightBar(t);
                            });
                        } else {
                            const err = response.data as unknown as ErrorDTO;
                            console.log(err);
                        }
                    });
            }
            return (<motion.div
                className="max-w-full sm:max-w-[32rem] h-full gap-2 flex flex-col px-8 sm:pl-8 sm:pr-2"
                transition={{ duration: 0.2, delay: 0.1 }}
                initial={{ width: "0px" }}
                animate={{ width: "100%" }}
            >
                <CardShadow>
                    {closeable && <IconX className="self-end hover:scale-150 scale-125 transition-transform cursor-pointer"
                        onClick={() => closeRightBar()} />}
                    <h2 className="text-3xl">Carrito seleccionado</h2>
                    {
                        cart && <div className="flex flex-1 flex-col w-full gap-2">
                            {items &&
                                (items.length == 0 ? <div>No hay items</div>
                                    : items.map((item) => {
                                        return <div className="max-w-full rounded-xl min-h-20 bg-white/5 py-1 flex flex-col items-center gap-2" key={`c: ${item.calendarId} e: ${item.eventName} l: ${item.localityName}`} onClick={() => { }}>
                                            <div className="flex w-full px-2 gap-2">
                                                <Image src={item.eventImage} width={256} height={256} className="size-10 rounded-full" alt="event image" />
                                                <div className="flex flex-col flex-wrap text-wrap w-fit bg-gradient-to-b font-extrabold bg-clip-text text-transparent from-[#AA9CFF] via-[#EC9FFF] to-[#FFABB9] ">
                                                    <label className="font-extrabold">{item.calendarName}</label>
                                                    <p className="break-all">
                                                        <span>{"Evento: " + item.eventName}</span>
                                                        <br />
                                                        <span>{"Localidad: " + item.localityName}</span>
                                                        <br />
                                                        <span>{`Cantidad: ${item.quantity} / ${item.freeTickets}`}</span>
                                                        <br />
                                                        <span>{"Precio: $" + (item.price) + " C/U"}</span>
                                                        <br />
                                                        <span>{"Subtotal: $" + (item.price * item.quantity)}</span>

                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end w-full mr-4">
                                                <Link
                                                    className="hover:scale-125 cursor-pointer transition-transform"
                                                    href={`/home/calendars/${item.calendarId}/${encodeURIComponent(item.eventName)}`}
                                                    onClick={() => closeModal()}
                                                ><IconEye /></Link>
                                                <IconEdit
                                                    className="hover:scale-125 cursor-pointer transition-transform"
                                                    onClick={() => {
                                                        const onSubmit = (e: FormEvent<HTMLFormElement>) => {
                                                            e.preventDefault();
                                                            const formdata = new FormData(e.currentTarget);
                                                            const formQuantity = formdata.get("quantity")?.toString();
                                                            const quantity = Number.parseInt(formQuantity || "0");
                                                            addItemToCart(
                                                                {
                                                                    calendarId: item.calendarId,
                                                                    cartId: cart.id,
                                                                    eventName: item.eventName,
                                                                    localityName: item.localityName,
                                                                    quantity: quantity
                                                                }, getCookie("jwt") || "").then((response) => {
                                                                    if (response.status == 200)
                                                                        carritoSiSeleccionado().then(t => {
                                                                            openRightBar(t);
                                                                            closeModal();
                                                                        })
                                                                    else if (response.status == 400) {
                                                                        const multi = response.data as unknown as BadRequestFieldsDTO;
                                                                        openModal(multi.errors.map((err) => (err.field + ": " + err.message)).join(""))
                                                                    } else if (response.status == 409) {
                                                                        const error = response.data as unknown as ErrorDTO;
                                                                        openModal(error.message)
                                                                    }
                                                                })

                                                        }
                                                        findEvent({ idCalendar: item.calendarId, name: item.eventName }).then(response => {
                                                            if (response.status == 200 && response.data.response) {
                                                                const result = response.data.response.localities.filter((l) => l.name === item.localityName);
                                                                if (result && result.length > 0)
                                                                    closeRightBar();
                                                                const max = result[0].maxCapability - result[0].ticketsSold;
                                                                openCustomModal(
                                                                    <form onSubmit={onSubmit}
                                                                        className="rounded-lg bg-[#292e34] p-2 flex flex-col gap-2">
                                                                        <label>Ingresa una cantidad</label>
                                                                        <input
                                                                            type="number"
                                                                            name="quantity"
                                                                            placeholder="Cantidad a comprar" />
                                                                        <p className="validator-message">{`Máximo ${max}`}</p>
                                                                        <div className="flex gap-1">
                                                                            <button type="submit">Cambiar</button>
                                                                            <button type="button" className="button-secondary" onClick={() => closeModal()}>Cancelar</button>
                                                                        </div>
                                                                    </form>
                                                                )
                                                            }
                                                        })

                                                    }} />
                                                <IconTrash
                                                    className="hover:scale-125 cursor-pointer transition-transform"
                                                    onClick={() => removeItem(item)}
                                                />
                                            </div>
                                        </div>
                                    })
                                )
                            }
                        </div>
                    }

                    <div className="flex w-full gap-2 sm:flex-row flex-col">
                        <button className="w-full text-nowrap button-secondary" onClick={() => {
                            deleteCookie("cart");
                            closeRightBar();
                            openCartAction(openRightBar, closeRightBar, closeable, setItems, items, openCustomModal, closeModal, openModal);
                        }}>Quitar selección</button>
                        <Link className="w-full" href={"/home/cart"}><button type="button" className="w-full">Pagar</button></Link>
                    </div>
                </CardShadow>
            </motion.div >)
        } else if (response.status == 403) {
            closeModal();
            closeRightBar();
        }
    }

    if (!cartId && jwt) {
        const carts = { carts: null as (CartDTO[] | null) }
        findAllCarts(jwt).then((response) => {
            carts.carts = response.data.response;
            openRightBar(<motion.div
                className="max-w-full sm:max-w-[32rem] h-full gap-2 flex flex-col px-8 sm:pl-8 sm:pr-2"
                transition={{ duration: 0.2, delay: 0.1 }}
                initial={{ width: "0px" }}
                animate={{ width: "100%" }}
            >
                <CardShadow>
                    {closeable && <IconX className="self-end hover:scale-150 scale-125 transition-transform cursor-pointer"
                        onClick={() => closeRightBar()} />}
                    <h2 className="text-3xl">Selecciona un carrito</h2>
                    <div className="flex-1 h-full gap-2 flex flex-col">
                        {
                            carts.carts &&
                            carts.carts.map((cart) => {
                                const date = new Date(cart.date);
                                return (
                                    <div key={cart.id}
                                        className="py-1 px-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col"
                                        onClick={() => {
                                            setCookie("cart", cart.id);
                                            carritoSiSeleccionado().then(t => {
                                                openRightBar(t);
                                            })
                                        }}>
                                        <label className="pointer-events-none">{`Fecha de modificación: ${date.toLocaleDateString()}`}</label>
                                        <label className="pointer-events-none">{`Hora: ${date.toLocaleTimeString()}`}</label>
                                        <label className="pointer-events-none">{`Tamaño: ${cart.items.length}`}</label>
                                    </div>
                                )
                            })

                        }

                    </div>
                    <div className="flex w-full gap-2 sm:flex-row flex-col">
                        <button className="sm:flex-1 button-secondary">Buscar Carritos</button>
                        <button className="sm:flex-1" onClick={() => {
                            createCart(jwt).then((r) => {
                                if (r.status == 200) {
                                    findAllCarts(jwt).then((res) => {
                                        carts.carts = res.data.response;
                                    })
                                }
                            })
                        }}>Agregar Carrito</button>
                    </div>
                </CardShadow>
            </motion.div>)
        })

    } else if (jwt) {
        // BUSCAR CARRITO
        carritoSiSeleccionado().then(t => {
            openRightBar(t);
        })
    }
}


export { openCartAction };

