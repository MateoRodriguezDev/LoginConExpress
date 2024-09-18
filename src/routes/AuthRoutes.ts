import { Router } from "express";
import { body } from "express-validator";
import { handleErrors, verifyToken } from "../middlewares";
import { login, profile } from "../controllers/auth";

const router = Router()

router.post('/login', 
    body('email')
        .isEmail().withMessage('Ingrese un correo valido'),
    body('password')
        .notEmpty().withMessage('Ingrese una contraseña')
        .isString().withMessage('Ingrese una contraseña valida'),
    
    handleErrors,
    login
)

router.get('/profile', verifyToken, profile)



export default router