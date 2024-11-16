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
    initPoint: string,
    payment: Payment,
    items: OrderDetailDTO[],
    status: string,
    total: number,
    couponId: ObjectId,
}
interface URLDTO {
    url: string
}

interface OrderDetailDTO {
    calendarId: string,
    eventId: string,
    localityId: string,
    calendarName: string,
    eventName: string,
    localityName: string,
    eventImage: string,
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
    eventId: string,
    isUnique: boolean
}

interface CartDetailDTO {
    quantity: number,
    calendarId: string,
    eventId: string,
    eventName: string,
    localityId: string,
    localityName: string,
    price: number
    calendarName: string,
    eventImage: string,
    freeTickets: number
}

interface CouponInfoDTO {
    discount: number,
    expiryDate: string,
    code: string,
    status: string,
    type: string,
    name: string,
    calendarId: string | null,
    calendarName: string | null,
    eventId: string | null,
    eventName: string | null
}

interface EventReportDTO {
    byteArray: Uint8Array;
    filename: string;
    filetype: string;
    sellPercentage: number;
    soldPercentageByLocality: LocalityDataDTO[];
    earnedTotal: number;
    capabilityTotal: number;
    ticketsSoldTotal: number;
}

interface LocalityDataDTO {
    locality: Locality;
    soldPercentage: number;
}
interface Locality {
    id: string;
    name: string;
    price: number;
    ticketsSold: number;
    maxCapability: number;
    retention: number;
}


export const eventTypes = ["SPORT", "CONCERT", "CULTURAL", "FASHION", "BEAUTY"];

interface FindEventDTO {
    calendarId: string,
    id: string,
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
    idEvent: string,
    name?: string,
    newName?: string | null,
    eventImage?: File | null,
    localityImage?: File | null,
    city?: string | null,
    description?: string | null,
    address?: string | null,
    startTime?: string | null,
    endTime?: string | null,
    localities?: FindEventLocalityDTO[],
    tags?: EventTagDTO[],
    status?: "ACTIVE" | "INATIVE" | "DELETED",
    type?: typeof eventTypes[number];
}

interface AddEventDTO {
    idCalendar: string,
    name: string,
    eventImage: File,
    localityImage: File,
    city: string,
    description: string,
    address: string,
    startTime: string,
    endTime: string,
    status: "ACTIVE" | "INATIVE",
    type: typeof eventTypes[number],
    tags: EventTagDTO[],
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
    id: string,
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

interface AccountInfoDTO {
    name: string,
    cedula: string,
    adress: string,
    city: string,
    phone: string
}

export type {
    LoginResponseDTO, CheckUserDTO, FindEventDTO, FindEventLocalityDTO, EventTagDTO, ResponseDTO,
    CalendarDTO, CalendarOnlyDTO, EditEventDTO, BadRequestFieldsDTO, CartDTO, CartDetailDTO, ErrorDTO,
    AppliedCouponDTO, OrderDTO, OrderDetailDTO, Payment, URLDTO, AccountInfoDTO, AddEventDTO, CouponInfoDTO,
    EventReportDTO, LocalityDataDTO, Locality
};
