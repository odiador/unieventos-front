
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

export type { LoginResponseDTO, CheckUserDTO, FindEventDTO, FindEventLocalityDTO, EventTagDTO, ResponseDTO, CalendarDTO, CalendarOnlyDTO };