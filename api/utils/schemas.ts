
interface LoginResponseDTO {
    userData: { name: string, cedula: string, adress: string, city: string, phone: string },
    token: string
}

export type { LoginResponseDTO };