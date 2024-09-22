import { Request, Response } from "express";
import Admin from "../models/Admin.model";
import { hashPassword } from "../helpers";


export const getAdmins = async (req: Request, res: Response) => {
    const users = await Admin.findAll()
    res.json({data: users})
}

export const createAdmin = async (req: Request, res: Response) => {
    const {email, password} = req.body

    //Verifico si el usuario ya existe
    const exist = await Admin.findOne({where: {email}})
    if(exist){
        return res.status(409).json({error: 'El Usuario ya existe'})
    }

    const user = await Admin.create(req.body)

    //Hasheo contraseña
    user.password = await hashPassword(password)

    //Guardo el usuario
    await user.save()

    return res.json({data: {user: user.name, email}})
}





/** Creo un superusuario por defecto */
const createSuperAdmin = async () => {
    const superUser = await Admin.findOne({where: {email: 'super@super.com'}})
    const password = await hashPassword('superadmin')
    if(!superUser) {
        Admin.create({
            name: 'superadmin',
            email: 'super@super.com',
            password,
            rol: 'superadmin'
        })
    }
}

createSuperAdmin()