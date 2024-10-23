
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

export type { LoginResponseDTO, CheckUserDTO };