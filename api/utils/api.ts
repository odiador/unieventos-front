import { AccountInfoDTO, AddEventDTO, AppliedCouponDTO, CalendarOnlyDTO, CartDTO, CheckUserDTO, CouponInfoDTO, EditEventDTO, EventReportDTO, FindEventDTO, FindEventLocalityDTO, LoginResponseDTO, OrderDTO, ResponseDTO, URLDTO } from "./schemas";
const executeRequest = async<T>(uri: string, options: RequestInit): Promise<{ status: number, data: ResponseDTO<T> }> => {
    let data;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${uri}`, options);
        data = await res.json();
        data = data as ResponseDTO<T>;
        return { status: res.status, data };
    } catch (e) {
        if (!data) data = { message: "Internal server Error " + e }
        return { status: 500, data: { message: data.message, response: null } };
    }
}

const validateMail = (email: string) => {
    return executeRequest(`/api/auth/validateMail?mail=${encodeURIComponent(email)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        }
    )
}

const editEvent = (data: EditEventDTO, token: string) => {
    const formData = new FormData();
    formData.append("idCalendar", data.idCalendar);
    formData.append("idEvent", data.idEvent);
    if (data.name)
        formData.append("name", data.name);
    if (data.address)
        formData.append("address", data.address);
    if (data.newName)
        formData.append("newName", data.newName);
    if (data.eventImage) formData.append("eventImage", data.eventImage);
    if (data.localityImage) formData.append("localityImage", data.localityImage);
    if (data.city)
        formData.append("city", data.city);
    if (data.description)
        formData.append("description", data.description);
    if (data.startTime)
        formData.append("startTime", data.startTime);
    if (data.endTime)
        formData.append("endTime", data.endTime);
    if (data.tags)
        data.tags.forEach((tag, i) => {
            formData.append(`tags[${i}].name`, tag.name)
            formData.append(`tags[${i}].color`, tag.color)
            formData.append(`tags[${i}].textColor`, tag.textColor)
        })
    if (data.status)
        formData.append("status", data.status);
    if (data.type)
        formData.append("type", data.type);
    if (data.localities)
        data.localities.forEach((loc, i) => {
            formData.append(`localities[${i}].id`, loc.id)
            formData.append(`localities[${i}].name`, loc.name)
            formData.append(`localities[${i}].price`, loc.price + "")
            formData.append(`localities[${i}].maxCapability`, loc.maxCapability + "")
        })
    return executeRequest<FindEventDTO>(`/api/events/edit`,
        {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData,
            credentials: 'include',
        }
    )
}

const editLocalities = (data: {
    idCalendar: string,
    idEvent: string,
    localities: FindEventLocalityDTO[],
}, token: string) => {
    const formData = new FormData();
    formData.append("idCalendar", data.idCalendar);
    formData.append("idEvent", data.idEvent);
    if (data.localities)
        data.localities.forEach((loc, i) => {
            formData.append(`localities[${i}].id`, loc.id)
            formData.append(`localities[${i}].name`, loc.name)
            formData.append(`localities[${i}].price`, loc.price + "")
            formData.append(`localities[${i}].maxCapability`, loc.maxCapability + "")
        })
    return executeRequest<FindEventDTO>(`/api/events/editLocalities`,
        {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData,
            credentials: 'include',
        }
    )
}

const deleteEvent = (data: { idCalendar: string, idEvent: string }, token: string) => {
    return executeRequest(`/api/events/delete`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }
    )
}


const addEvent = (data: AddEventDTO, token: string) => {
    const formData = new FormData();
    formData.append("idCalendar", data.idCalendar);
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("eventImage", data.eventImage);
    formData.append("localityImage", data.localityImage);
    formData.append("city", data.city);
    formData.append("description", data.description);
    formData.append("startTime", data.startTime);
    formData.append("endTime", data.endTime);
    formData.append("status", data.status);
    formData.append("type", data.type);
    data.tags.forEach((tag, i) => {
        formData.append(`tags[${i}].name`, tag.name)
        formData.append(`tags[${i}].color`, tag.color)
        formData.append(`tags[${i}].textColor`, tag.textColor)
    })

    return executeRequest<FindEventDTO>(`/api/events/create`,
        {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData,
            credentials: 'include',
        }
    )
}

const checkUser = (token: string) => {
    return executeRequest<CheckUserDTO>(`/api/auth/checkUser`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

const addItemToCart = (
    data: {
        cartId: string,
        quantity: number,
        calendarId: string,
        localityId: string,
        eventId: string
    }, token: string) => {
    return executeRequest<boolean>(`/api/carts/cart/addItem`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }
    )
}
const removeItemToCart = (
    data: {
        cartId: string,
        calendarId: string,
        eventId: string,
        localityId: string
    }, token: string) => {
    return executeRequest<boolean>(`/api/carts/cart/removeItem`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }
    )
}

const findCart = (idCart: string, token: string) => {
    return executeRequest<CartDTO>(`/api/carts/find`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: idCart,
            credentials: 'include',
        }
    )
}

const findOrder = (id: string, token: string) => {
    return executeRequest<OrderDTO>(`/api/orders/find?id=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}
const getAccountInfo = (token: string) => {
    return executeRequest<AccountInfoDTO>(`/api/clients/info`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}
const editUserData = (accInfo: AccountInfoDTO, token: string) => {
    return executeRequest<AccountInfoDTO>(`/api/clients/edit`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(accInfo),
            credentials: 'include',
        }
    )
}

const findAllOrders = (token: string) => {
    return executeRequest<OrderDTO[]>(`/api/orders/findAll`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

const payOrder = (id: string, token: string) => {
    return executeRequest<URLDTO>(`/api/orders/pay`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ id }),
            credentials: 'include',
        }
    )
}

const createOrder = (cartId: string, token: string, couponCode?: string) => {
    return executeRequest<OrderDTO>(`/api/orders/create?id=${cartId}${couponCode ? `&coupon=${couponCode}` : ""}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}
const cancelOrder = (id: string, token: string) => {
    return executeRequest(`/api/orders/cancel?id=${id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

const applyCoupon = (code: string, token: string) => {
    return executeRequest<AppliedCouponDTO>(`/api/coupons/apply/${code}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

const createCart = (token: string) => {
    return executeRequest(`/api/carts/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}


const findAllCarts = (token: string) => {
    return executeRequest<CartDTO[]>(`/api/carts/findAll`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            credentials: 'include',
        }
    )
}

function deleteAccount(data: { email: string, password: string }, jwt: string) {
    return executeRequest<String>("/api/clients/delete",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
            },
            body: JSON.stringify(data)
        })
}

function login(data: string) {
    return executeRequest<LoginResponseDTO>("/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data
        })
}

function loginCode(data: string) {
    return executeRequest<LoginResponseDTO>("/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data
        })
}

function findEvent(data: { idCalendar: string, idEvent: string }) {
    return executeRequest<FindEventDTO>("/api/events/find",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
}

function listCalendars(data: { page: number, size: number }) {
    return executeRequest<CalendarOnlyDTO[]>("/api/calendars/findByPage",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
}

function findCalendarOnly(id: string) {
    return executeRequest<CalendarOnlyDTO>("/api/calendars/findById",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: id
        })
}

function findEvents(data: { id: string, size: number, page: number }) {
    return executeRequest<FindEventDTO[]>("/api/events/list",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
}
function findEventsFilter(data: { id?: string, size: number, page: number, city?: string, tagName?: string, date?: string, name?: string }) {
    return executeRequest<FindEventDTO[]>("/api/events/list",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
}

function activate(values: { email: string; code: string; }) {
    return executeRequest<string>("/api/auth/activation/activate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        })
}
function sendActivation(email: string) {
    return executeRequest(`/api/auth/activation/send?email=${encodeURIComponent(email)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        })
}

function generateReport(data: { eventId: string, calendarId: string }, token: string) {
    return executeRequest<EventReportDTO>(`/api/reports/generate?eventId=${encodeURIComponent(data.eventId)}&calendarId=${encodeURIComponent(data.calendarId)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        })
}

function getCoupons(data: { page: number, size: number, status: string }, token: string) {
    return executeRequest<CouponInfoDTO[]>("/api/coupons/findCoupons",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(data)
        })
}


function signup(values: { email: string; password: string; name: string; cedula: string; phone: string; adress: string; }) {
    return executeRequest("/api/auth/create",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        })
}

export {
    activate, checkUser, findCalendarOnly, findEvent, findEvents, listCalendars, login, sendActivation,
    signup, validateMail, editEvent, findAllCarts, createCart, addItemToCart, findCart, removeItemToCart,
    applyCoupon, createOrder, findOrder, payOrder, findAllOrders, getAccountInfo, editUserData, deleteAccount,
    deleteEvent, addEvent, findEventsFilter, getCoupons, generateReport, cancelOrder, editLocalities
};
