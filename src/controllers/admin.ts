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


// /** Image Uploader */
// const extensions = ["jpg", "png", "jpeg"]

// export const updateProfile = async (req: Request, res: Response) => {
//     if(!req.files || Object.keys(req.files).length === 0){
//         return res.status(403).json('Imagen obligatoria')
//     }
    
//     const {file} = req.files as any

//     if(!file){
//         return res.status(403).json('Imagen obligatoria')
//     }

//     const nameAndExtension : string[] = file.name.split('.')
//     const extension = nameAndExtension[nameAndExtension.length - 1]
//     if(!extensions.includes(extension)){
//       return res.status(403).json({msg: `Imagen no valida, tipo de imagenes permitidos: ${extensions}`})
//     }
  
//     const tempName = uuid() + '.' + extension
//     const uploadPath = path.join(__dirname, '../uploads/', tempName)
//     file.mv(uploadPath, function(err: any) {
//       if(err){
//         res.status(500).json('Error al subir la imagen')
//       }
//     })

//     //Relacionamos la imagen con el usuario
//     req.user.profileIMG = `/uploads/${tempName}`
//     req.user.save()
  
//     res.status(201).json('Imagen de perfil actualizada correctamente')
// }


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