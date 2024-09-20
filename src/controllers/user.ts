import { Request, Response } from "express";
import Admin from "../models/Admin.model";
import { hashPassword } from "../helpers";
import User from "../models/User.model";


export const getUsers = async (req: Request, res: Response) => {
    const users = await User.findAll()
    res.status(200).json({data: users})
}

export const getUserById = async (req: Request, res: Response) => {
    const {userId} = req.params
    try {
        //Vemos si el usuario existe
        const user = await User.findByPk(userId)
        if(!user) return res.status(404).json({error: 'El Usuario no Existe'}) 

        res.status(200).json({data: user})
    } catch (error) {
        res.status(500).send('Ha ocurrido un error')
    }
}

export const createUser = async (req: Request, res: Response) => {
    const {email, password} = req.body
    
    try {
        //Verifico si el usuario ya existe
        let exist = await User.findOne({where: {email}})
        if(!exist) exist = await Admin.findOne({where: {email}})
        
        if(exist) return res.status(409).json({error: 'El Usuario ya existe'})
        

        const user = await User.create(req.body)

        //Hasheo contraseña
        user.password = await hashPassword(password)

        //Guardo el usuario
        await user.save()
        return res.status(201).json({data: {user: user.name, email}})
    } catch (error) {
        res.status(500).send('Ha ocurrido un error')
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const {userId} = req.params
    try {
        //Vemos si el usuario existe
        const user = await User.findByPk(userId)
        if(!user) return res.status(404).json({error: 'El Usuario no Existe'}) 

        //Actualizo el usuario
        await user.update(req.body)
        await user.save()
        
        res.status(203).json({data: user})
    } catch (error) {
        res.status(500).send('Ha ocurrido un error')
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const {userId} = req.params
    try {
        //Vemos si el usuario existe
        const user = await User.findByPk(userId)
        if(!user) return res.status(404).json({error: 'El Usuario no Existe'}) 

        //Borramos el usuario
        user.destroy()

        res.status(200).send('Usuario eliminado')
    } catch (error) {
        res.status(500).send('Ha ocurrido un error')
    }
}