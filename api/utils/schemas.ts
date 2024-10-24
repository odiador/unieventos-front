
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
    status: string,
    type: string
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

export type { LoginResponseDTO, CheckUserDTO, FindEventDTO, FindEventLocalityDTO, EventTagDTO, ResponseDTO };