import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import User from "../models/User.model";
import Admin from "../models/Admin.model";



/** EXPRESS VALIDATOR */
/**
 * @description
 * Maneja los errores, si hay algún error en el express-validator los manda por la respuesta
 * de no ser asi pasa al siguiente middleware
 * 
 * @param {Request} req - Objeto de solicitud de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @param {NextFunction} next - Funcion para pasar al siguiente middleware
 * @returns {void | Response} Devuelve errores o pasa al siguiente middleware
 */
export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};



/** JWT VALIDATOR */
/**
 * Verifica el JWT del header de la solicitud, si es valido guarda la info
 * del usuario en el request, sino devuelve un error dependiendo del caso
 * 
 * @param {Request} req - Objeto de solicitud de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @param {NextFunction} next - Funcion para pasar al siguiente middleware
 * @returns {Promise<void | Response>} Devuelve error o pasa al siguiente middleware
 */
export const verifyToken = async ( req: Request, res: Response, next: NextFunction) => {
  //Extraigo el token desde el header
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  //Verifico si esta vacío
  if (token == null) return res.status(401).send('Sin token en el header');

  try {
    //Verifico si el token es valido
    const decoded = jwt.verify(token, "PalabraSecreta") as JWTPayload;

    //Reviso si el usuario del jwt existe en mi base de datos
    let user: Admin | User | null = await Admin.findByPk(decoded.id);

    if(!user){
        user = await User.findByPk(decoded.id);
    }

    if(!user){
      return res.status(409).send('Usuario no valido');
    }

    //Devuelvo el user al header
    req.user = {id: decoded.id, email: decoded.email, rol: decoded.rol};
  } catch (error) {
    return res.status(403).send("Token no valido");
  }

  next();
};


/** AUTORIZACIONES DE USUARIOS */
/**
 * Verifica si el usuario del request es superAdmin
 * 
 * @param {Request} req - Objeto de solicitud de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @param {NextFunction} next - Función para pasar al siguiente middleware
 * @returns {Promise<void | Response>} Devuelve error o pasa al siguiente middleware
 */
export const isSuperAdmin = async ( req: Request, res: Response, next: NextFunction) => {
  if(!req.user){
    return res.status(403).send("Inicie Sesión");
  }
  if(req.user.rol !== 'superadmin'){
    return res.status(403).send("Solo el superusuario esta autorizado");
  }
  next()
}


/**
 * Verifica si el usuario del request es admin
 * 
 * @param {Request} req - Objeto de solicitud de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @param {NextFunction} next - Función para pasar al siguiente middleware
 * @returns {Promise<void | Response>} Devuelve error o pasa al siguiente middleware
 */

export const isAdmin = async ( req: Request, res: Response, next: NextFunction) => {
  if(!req.user){
    return res.status(403).send("Inicie Sesión");
  }
  if(req.user.rol !== 'admin' && req.user.rol !== 'superadmin'){
    return res.status(403).send("Solo administradores estan autorizados");
  }
  next()
}


/**
 * Verifica si el usuario del request es user
 * 
 * @param {Request} req - Objeto de solicitud de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @param {NextFunction} next - Función para pasar al siguiente middleware
 * @returns {Promise<void | Response>} Devuelve error o pasa al siguiente middleware
 */
export const isUser = async ( req: Request, res: Response, next: NextFunction) => {
  if(!req.user){
    return res.status(403).send("Inicie Sesión");
  }
  if(req.user.rol !== 'superadmin' && req.user.rol !== 'admin' && req.user.rol !== 'user'){
    return res.status(403).send("No autorizado");
  }
  next()
}






