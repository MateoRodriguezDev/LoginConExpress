import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import User from "../models/User.model";

export const handleErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Extraigo el token desde el header
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  //Verifico si esta vacío
  if (token == null) return res.status(401).json('Sin token en el header');

  try {
    //Verifico si el token es valido
    const decoded = jwt.verify(token, "PalabraSecreta") as JWTPayload;

    //Reviso si el usuario del jwt existe en mi base de datos
    const user = await User.findByPk(decoded.id);

    if(!user){
      return res.status(409).json('Error en el perfil');
    }

    //Devuelvo el user al header
    req.user = user;
  } catch (error) {
    return res.status(403).json("Token no valido");
  }

  next();
};
