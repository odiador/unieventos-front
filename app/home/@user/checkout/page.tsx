"use client";

import { applyCoupon, createOrder, findCart } from "@/api/utils/api";
import { useAuthContext } from "@/api/utils/auth";
import { AppliedCouponDTO, BadRequestFieldsDTO, CartDetailDTO, CartDTO, ErrorDTO } from "@/api/utils/schemas";
import CardShadow from "@/components/cardshadow";
import { useModal } from "@/components/modal";
import { IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Cart = () => {
    const { updateRole } = useAuthContext();
    const { openModal } = useModal();
    const [cartData, setCartData] = useState<CartDTO>();
    const [cartDataUpdated, setCartDataUpdated] = useState<CartDTO>();
    const [couponShowing, setCouponShowing] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState(false);
    const [validCoupon, setValidCoupon] = useState<AppliedCouponDTO>();
    const [couponCode, setCouponCode] = useState("");
    const router = useRouter();

    const [extraData, setExtraData] = useState<{ date: Date, subtotal: number, total: number }>();

    function updateData() {
        if (cartData && cartDataUpdated) {
            const subtotal = cartDataUpdated.items.map(i => i.price * i.quantity).reduce((acum, current) => acum + current, 0);
            setExtraData({
                date: new Date(cartData.date),
                subtotal: subtotal,
                total: subtotal
            });
        } else {
            setExtraData(undefined);
        }
    }
    useEffect(() => {
        if (cartData && cartDataUpdated && validCoupon && !appliedDiscount) {
            const multiplier = (100 - validCoupon.discount) / 100;
            const items = JSON.parse(JSON.stringify(cartData.items)) as CartDetailDTO[];
            cartDataUpdated.items = items.map(i => {
                if (!validCoupon.forSpecialEvent
                    || (validCoupon.forSpecialEvent && validCoupon.calendarId === i.calendarId && validCoupon.eventId === i.eventId))
                    i.price *= multiplier;
                return i;
            })
            setAppliedDiscount(true);
            updateData();
        }
    }, [validCoupon])
    useEffect(() => {
        updateData();
    }, [cartDataUpdated])
    useEffect(() => {
        updateRole().then((u) => {
            const jwt = getCookie("jwt");
            const cart = getCookie("cart");
            if (cart && jwt) {
                findCart(cart, jwt).then(response => {
                    if (response.status == 200) {
                        const cartData = response.data.response || undefined;
                        setCartData(JSON.parse(JSON.stringify(cartData)));
                        setCartDataUpdated(JSON.parse(JSON.stringify(cartData)));
                    } else {
                        const errorData = response.data as unknown as ErrorDTO;
                        openModal(errorData.message);
                    }
                })
            }
        })
    }, [])
    return (
        <div className="w-full p-2">
            {!cartData && <div> No hay carrito</div>}
            {cartData && cartDataUpdated && extraData && <CardShadow className="gap-0">
                <div className="w-full flex flex-col gap-0 pb-4">
                    <h1 className="text-3xl font-bold">Tu carrito</h1>
                    <label className="text-sm text-white/70 mb-2">{`Ult. modificación: ${extraData.date.toLocaleDateString()} ${extraData.date.toLocaleTimeString()}`}</label>
                    <label className="text-sm text-white/70 w-fit cursor-pointer hover:text-white underline transition-colors">¿No es tu carrito? Cambia de carrito</label>
                </div>
                <div className="flex lg:hidden flex-col w-full px-4">
                    <h1 className="text-3xl font-semibold text-nowrap">Resumen del pedido</h1>
                    {validCoupon && <label className="text-white/90">{`${validCoupon.discount}% de DCTO${validCoupon.forSpecialEvent ? " para el evento seleccionado" : ""}`}</label>}
                    <p className="text-white/70">{`${cartData.items.length} artículo${cartData.items.length == 1 ? "" : "s"}`}</p>
                    <hr className="h-px border-0 w-full bg-white/10 my-4" />
                </div>
                <div className="flex lg:flex-row flex-col items-start gap-2">
                    <div className="w-full grid grid-cols-7 place-items-center gap-x-[1px]">
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Imagen</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Calendario</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Evento</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Localidad</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Valor Unitario</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Cantidad</label>
                        <label className={`text-sm bg-white w-full h-full text-center content-center text-black py-1.5 break-all`}>Precio</label>
                        {cartDataUpdated.items.map((item, idx) => {
                            const clsName = `text-sm bg-white/${idx % 2 == 0 ? "5" : "10"} w-full h-full text-center content-center break-all`;
                            return (
                                <div className="w-full break-allrounded-md grid grid-cols-7 col-span-7 gap-x-[1px] place-items-center"
                                    key={item.calendarId + item.eventName + item.localityName}>
                                    <div className={`text-sm bg-white/${idx % 2 == 0 ? "5" : "10"} w-full h-full text-center flex justify-center items-center`}>
                                        <Image
                                            className="w-10 h-fit"
                                            src={item.eventImage}
                                            alt={"Imagen item carrito"}
                                            width={512}
                                            height={512} />
                                    </div>
                                    <label className={clsName}>{item.calendarName}</label>
                                    <label className={clsName}>{item.eventName}</label>
                                    <label className={clsName}>{item.localityName}</label>
                                    <label className={clsName}>{`$${item.price}`}</label>
                                    <label className={clsName}>{item.quantity}</label>
                                    <label className={clsName}>{`$${item.price * item.quantity}`}</label>
                                </div>
                            )
                        })
                        }

                    </div>
                    <form className="flex flex-col lg:w-fit w-full px-4" onSubmit={(e) => {
                        e.preventDefault();
                        const jwt = getCookie("jwt");
                        if (jwt)
                            createOrder(cartData.id, jwt, validCoupon ? couponCode : undefined).then((response) => {
                                if (response.status == 200) {
                                    const order = response.data.response;
                                    if (order) {
                                        router.push(`/home/orders/${order.id}`)
                                    }
                                } else if (response.status == 400) {
                                    const errors = response.data as unknown as BadRequestFieldsDTO;
                                    openModal(JSON.stringify(errors));
                                } else {
                                    const errorData = response.data as unknown as ErrorDTO;
                                    openModal(errorData.message);
                                }
                            })


                    }}>

                        <div className="lg:flex hidden flex-col w-fit px-4">
                            <h1 className="text-3xl font-semibold text-nowrap">Resumen del pedido</h1>
                            {validCoupon && <label className="text-white/90">{`${validCoupon.discount}% de DCTO${validCoupon.forSpecialEvent ? " para el evento seleccionado" : ""}`}</label>}
                            <p className="text-white/70">{`${cartData.items.length} artículo${cartData.items.length == 1 ? "" : "s"}`}</p>
                            <hr className="h-px border-0 bg-white/10 my-4" />
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className={`${!validCoupon && "underline cursor-pointer"} w-fit`}
                                onClick={() => {
                                    if (!validCoupon) {
                                        setCouponShowing(prev => !prev)
                                    }
                                }}>{validCoupon ? "Cupón:" : "¿Cuentas con un cupón?"}
                            </p>
                        </div>
                        <div className="my-2 flex gap-2 items-center" style={{ display: couponShowing ? "flex" : "none" }} >
                            {!validCoupon && <input placeholder="Cupón" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />}
                            {!validCoupon && <button type="button" onClick={e => {
                                e.preventDefault();
                                const jwt = getCookie("jwt");
                                if (jwt) {
                                    applyCoupon(couponCode, jwt).then(response => {
                                        if (response.status == 200) {
                                            setValidCoupon(response.data.response || undefined);
                                        } else {
                                            const errorData = response.data as unknown as ErrorDTO;
                                            openModal(errorData.message);
                                        }
                                    })
                                } else {
                                    openModal("No hay login");
                                }

                            }}>Aplicar</button>}
                            {validCoupon && (<div className="w-full flex flex-col">
                                <div className="flex items-center gap-2">
                                    <input className="font-bold w-full text-teal-200" name="coupon" placeholder="Cupón" defaultValue={validCoupon.code} readOnly />
                                    <IconX className="hover:scale-125 transition-transform cursor-pointer" onClick={() => {
                                        setValidCoupon(undefined)
                                        setCartDataUpdated(JSON.parse(JSON.stringify(cartData)))
                                        setAppliedDiscount(false)
                                    }} />
                                </div>
                            </div>)}

                        </div>
                        <h3>{`Subtotal: $${extraData.total}`}</h3>
                        <div className="flex w-full gap-2 sm:gap-4 lg:gap-2 sm:flex-row flex-col">
                            <button className="w-full button-secondary" type="button" onClick={() => router.back()}>Volver</button>
                            <button className="w-full" type="submit">Crear orden</button>
                        </div>
                    </form>
                </div>
            </CardShadow >}
        </div >
    );
}

export default Cart;
