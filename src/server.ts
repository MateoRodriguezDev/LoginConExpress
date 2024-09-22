import path from 'path'
import express from 'express'
import cors from 'cors'
import colors from 'colors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import db from './config/db'
import adminRouter from './routes/AdminRoutes'
import userRouter from './routes/UserRoutes'
import authRouter from './routes/AuthRoutes'
import receiptRouter from './routes/ReceiptRoute'

/** Conexion a la base de datos */
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.magenta.bold('Conexion exitosa a la base de datos'))
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar a la base de datos'))
    }
}
connectDB()

const app = express()

/** Configuración */
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({}))
app.use(fileUpload({
    // Opciones (son opcionales, pero pueden ser útiles)
    limits: { fileSize: 50 * 1024 * 1024 }, // Limitar tamaño del archivo (50MB en este caso)
    abortOnLimit: true, // Cancelar la subida si se excede el límite
    useTempFiles: true, // Utiliza archivos temporales para manejar la carga
    tempFileDir: path.join(__dirname, 'tmp'), // Directorio temporal
  }));

/** Middlewares */
app.use(morgan('dev'))

/** Rutas */
app.use('/api/admins',adminRouter)
app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/receipts',receiptRouter)




export default app