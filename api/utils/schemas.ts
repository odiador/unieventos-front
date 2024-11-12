import { ObjectId } from "bson";

interface LoginResponseDTO {
    userData: { name: string, cedula: string, adress: string, city: string, phone: string },
    role: "CLIENT" | "ADMINISTRATOR",
    email: string,
    token: string
}

interface CheckUserDTO {
    name: string,
    role: "CLIENT" | "ADMINISTRATOR",
    email: string,
}

interface CartDTO {
    id: string,
    date: string,
    items: CartDetailDTO[],
    userId: string
}

interface OrderDTO {
    id: string,
    clientId: string,
    timestamp: string,
    payment: Payment,
    items: OrderDetailDTO[],
    status: string,
    total: number,
    couponId: ObjectId,
}

interface OrderDetailDTO {
    calendarId: string,
    eventName: string,
    localityName: string,
    price: number,
    quantity: number
}

interface Payment {
    id: string,
    currency: string,
    paymentType: string,
    statusDetail: string
    authorizationCode: string
    status: string
    transationValue: number
}

interface AppliedCouponDTO {
    id: string,
    code: string,
    discount: number,
    forSpecialEvent: boolean,
    calendarId: string,
    eventName: string,
    isUnique: boolean
}

interface CartDetailDTO {
    quantity: number,
    calendarId: string,
    eventName: string,
    localityName: string,
    price: number
    calendarName: string,
    eventImage: string,
    freeTickets: number
}


export const eventTypes = ["SPORT", "CONCERT", "CULTURAL", "FASHION", "BEAUTY"];

interface FindEventDTO {
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
    status: "ACTIVE" | "INATIVE" | "DELETED",
    type: typeof eventTypes[number];
}

interface BadRequestFieldsDTO {
    status: number,
    message: string,
    errors: { field: string, message: string }[]
}

interface ErrorDTO {
    status: number,
    message: string,
}

interface EditEventDTO {
    idCalendar: string,
    name: string,
    newName?: string | null,
    eventImage?: string | null,
    localityImage?: string | null,
    city?: string | null,
    description?: string | null,
    address?: string | null,
    startTime?: string | null,
    endTime?: string | null,
    localities?: FindEventLocalityDTO[],
    tags: EventTagDTO[],
    status: "ACTIVE" | "INATIVE" | "DELETED",
    type: typeof eventTypes[number];
}

interface CalendarDTO {
    id: string,
    name: string,
    description: string,
    events: FindEventDTO[],
    image: string,
    bannerImage: string,
}
interface CalendarOnlyDTO {
    id: string,
    name: string,
    description: string,
    image: string,
    bannerImage: string,
    tags: EventTagDTO[]
}

interface FindEventLocalityDTO {
    name: string,
    price: number,
    ticketsSold: number,
    maxCapability: number
}

interface EventTagDTO {
    name: string,
    color: string,
    textColor: string
}

interface ResponseDTO<T> {
    message: string,
    response: T | null
}

export type {
    LoginResponseDTO, CheckUserDTO, FindEventDTO, FindEventLocalityDTO, EventTagDTO, ResponseDTO,
    CalendarDTO, CalendarOnlyDTO, EditEventDTO, BadRequestFieldsDTO, CartDTO, CartDetailDTO, ErrorDTO,
    AppliedCouponDTO, OrderDTO, OrderDetailDTO, Payment
};
