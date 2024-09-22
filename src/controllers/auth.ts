import { Request, Response } from "express"
import { checkPassword, generateToken } from "../helpers"
import Admin from "../models/Admin.model"
import User from "../models/User.model"

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    //Verifico si el usuario es un doctor
    let user: Admin | User | null = await User.findOne({where: {email}})

    if(!user){
        user = await Admin.findOne({where: {email}})
    }
    
    if(!user){
        return res.status(401).send('Correo o Contraseña incorrectos');
    }

    const isValidPassword = await checkPassword(password, user.password)
    console.log(isValidPassword)

    
    if(!isValidPassword){
        return res.status(401).send('Correo o Contraseña incorrectos');
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        rol: 'rol' in user ? user.rol : 'user'
    })

    res.status(200).json(token)

}