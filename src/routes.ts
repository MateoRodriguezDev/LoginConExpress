import {request, Router} from 'express'
import { body } from 'express-validator'
import { getUsers, createUser, loginUser, getUserById, updateProfile } from './handlers/user'
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

router.post('/login', 
    body('email')
        .isEmail().withMessage('Ingrese un correo valido'),
    body('password')
        .notEmpty().withMessage('Ingrese una contraseña')
        .isString().withMessage('Ingrese una contraseña valida'),
    
    handleErrors,
    loginUser
)

router.get('/profile', verifyToken, getUserById)

router.post('/profile/update', verifyToken, updateProfile)

export default router