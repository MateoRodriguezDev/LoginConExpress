import {request, Router} from 'express'
import multer from 'multer'
import { body } from 'express-validator'
import { getUsers, createUser, loginUser, getUserById } from './handlers/user'
import { handleErrors, verifyToken } from './middlewares'


const router = Router()



router.get('/', getUsers)

router.post('/register', 

    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío')
        .isString().withMessage('El nombre debe ser un string')
        .isLength({min: 5, max: 15}),

    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email valido'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    
    handleErrors,
    createUser
)

router.post('/login', loginUser)

router.get('/profile', verifyToken, getUserById)

export default router