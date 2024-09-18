import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import User from "../models/User.model";
import Admin from "../models/Admin.model";



/** Express Validator */
export const handleErrors = (req: Request, res: Response, next: NextFunction) => {
  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};


/** JWT Validator */
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


export const isAdmin = async ( req: Request, res: Response, next: NextFunction) => {
  if(!req.user){
    return res.status(403).send("Inicie Sesión");
  }
  if(req.user.rol !== 'superadmin'){
    return res.status(403).send("Solo el superusuario esta autorizado");
  }
  next()
}

export const isUser = async ( req: Request, res: Response, next: NextFunction) => {
  if(!req.admin && !req.user){
    return res.status(403).send("Inicie Sesión");
  }
  if(req.admin.rol !== 'superadmin' && req.admin.rol !== 'admin' && req.user.rol !== 'user'){
    return res.status(403).send("Solo el superusuario esta autorizado");
  }
  next()
}


