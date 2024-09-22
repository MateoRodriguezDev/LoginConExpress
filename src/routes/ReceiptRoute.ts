import { Router } from "express";
import { createReceipt, deleteReceipt, getReceiptById, getReceipts, getReceiptsByUser } from "../controllers/receipt";
import { handleErrors, isAdmin, isUser, verifyToken } from "../middlewares";
import { param } from "express-validator";


const router = Router()
router.use(verifyToken)


router.post('/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    isAdmin,
    handleErrors,
    createReceipt
)

router.get('/', isAdmin,getReceipts)

router.get('/:receiptId', 
    param('receiptId')
        .isInt({ gt: 0 }).withMessage('El ID del Recibo debe ser un número entero positivo'),
    isUser,
    handleErrors,
    getReceiptById
)

router.get('/user/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    isUser,
    handleErrors,
    getReceiptsByUser
)

router.delete('/:receiptId', 
    param('receiptId')
        .isInt({ gt: 0 }).withMessage('El ID del Recibo debe ser un número entero positivo'),
    isAdmin,
    handleErrors,
    deleteReceipt
)


export default router