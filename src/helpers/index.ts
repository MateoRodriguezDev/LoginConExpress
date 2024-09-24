import {exit} from 'node:process'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import db from '../config/db';
import { Payload } from "../types";
import bcrypt from 'bcrypt'

dotenv.config()

/**
 * Genera un JWT que dura 180 días utilizando una palabra secreta
 * 
 * @param {Payload} payload - Los datos que se incluirán en el token JWT
 * @returns {string} El token JWT generado
 */
export function generateToken(payload: Payload) {
  const options = {
    expiresIn: "180d",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

/**
 * Hashea la contraseña con bcrypt y un salt de 10
 * 
 * @param {string} password - La contraseña en texto plano que será hasheada
 * @returns {Promise<string>} El hash de la contraseña
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Verifica si la contraseña hasheada es correcta
 * 
 * @param {string} enteredPassword - La contraseña que puso el usuario
 * @param {string} storedHash - La contraseña hasheada
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, `false` en caso contrario
 */
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
  return await bcrypt.compare(enteredPassword, storedHash)
}