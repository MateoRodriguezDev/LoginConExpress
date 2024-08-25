import jwt from "jsonwebtoken";
import { Payload } from "../types";
import fs from 'node:fs'

export function generateToken(payload: Payload) {
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, "PalabraSecreta", options);
  return token;
}

export function saveImage(file: Express.Multer.File, userName : string) {
  const fileExtension = file.originalname.split('.')[1]
  const newPath = `./public/uploads/${userName}.${fileExtension}`
  fs.renameSync(file.path, newPath)
  return newPath
}
