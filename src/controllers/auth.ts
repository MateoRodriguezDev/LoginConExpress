import { Request, Response } from "express"
import { checkPassword, generateToken } from "../helpers"
import Admin from "../models/Admin.model"
import User from "../models/User.model"




/**
 * Inicio de sesión, si el correo y contraseña son correctos devuelve un JWT
 * 
 * @param {Request} req - Objeto de solicitud de Express con correo y contraseña
 * @param {Response} res - Objeto de respuesta de Express
 * @returns {Promise<Response>} Devuelve error o un JWT
 */
export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    //Verifico si el usuario es un usuario
    let user: Admin | User | null = await User.findOne({where: {email}})

    if(!user){
        //Verifico si el usuario es un administrador
        user = await Admin.findOne({where: {email}})
    }
    
    if(!user){
        return res.status(401).send('Correo o Contraseña incorrectos');
    }

    //Verificó que la contraseña sea correcta
    const isValidPassword = await checkPassword(password, user.password)
    console.log(isValidPassword)

    
    if(!isValidPassword){
        return res.status(401).send('Correo o Contraseña incorrectos');
    }

    //Devuelve un JWT
    const token = generateToken({
        id: user.id,
        email: user.email,
        rol: 'rol' in user ? user.rol : 'user'
    })

    res.status(200).json(token)

}