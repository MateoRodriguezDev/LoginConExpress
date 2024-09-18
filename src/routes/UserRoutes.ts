import {Router} from 'express'
import { body } from 'express-validator'
import { getAdmins, createAdmin } from '../controllers/admin'
import { handleErrors, isAdmin, verifyToken } from '../middlewares'


const router = Router()
router.get('/', verifyToken, isAdmin, getAdmins)

router.post('/register', 
    body('name')
        .isString().withMessage('El nombre debe ser un string')
        .trim().isLength({min: 5, max: 15}).withMessage('Minimo 5 caracteres, maximo 15'),

    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email valido'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    verifyToken,
    isAdmin,
    handleErrors,
    createAdmin
)


export default router