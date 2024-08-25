import { Request, Response } from "express";
import User from "../models/User.model";
import { generateToken, saveImage } from "../helpers";
import { Payload } from "../types";


export const getUsers = async (req: Request, res: Response) => {
    const users = await User.findAll()
    res.json({data: users})
}

export const createUser = async (req: Request, res: Response) => {
    const user = await User.create(req.body)
    if(req.file){
        saveImage(req.file, user.name)
    }
    return res.json({data: user})
}

export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body
    
    //Verificamos que el usuario exista
    const user = await User.findOne({where: {email}})
    if(!user){
        return res.status(404).json({error: 'El Usuario no existe'})
    }
    
    //Verificamos que la contraseña sea correcta
    const isPasswordValid = user.password === password
    if(!isPasswordValid){
        return res.status(404).json({error: 'La contraseña no es correcta'})
    }
    
    //Devolvemos un token con los datos del usuario que requiera el front
    const payload : Payload = {
        id: user.id,
        username: user.name
    }
    return res.status(200).json({token: generateToken(payload)})
} 

export const getUserById = (req: Request, res: Response) => {
    const {name, email} = req.user
    const imageProfile = `./uploads/${name}`
    res.json({vista: "Perfil", user: {name, email, imageProfile}})
}