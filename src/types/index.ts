import { JwtPayload } from "jsonwebtoken"

export type Payload = {
    id: string
    username: string
}

//Creo este tipo para cuando recibo el token
export type JWTPayload = JwtPayload & {
    id: string
    username: string
}

