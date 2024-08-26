import jwt from "jsonwebtoken";
import { Payload } from "../types";
import fs from 'node:fs'
import bcrypt from 'bcrypt'

export function generateToken(payload: Payload) {
  const options = {
    expiresIn: "180d",
  };
  const token = jwt.sign(payload, "PalabraSecreta", options);
  return token;
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (enteredPassword: string, storedHash: string) => {
  return await bcrypt.compare(enteredPassword, storedHash)
}