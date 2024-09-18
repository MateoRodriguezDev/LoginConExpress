import express from 'express'
import cors from 'cors'
import colors from 'colors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import db from './config/db'
import adminRouter from './routes/AdminRoutes'
import userRouter from './routes/UserRoutes'
import authRouter from './routes/AuthRoutes'

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
    useTempFiles: true, 
    tempFileDir: "/tmp/",
    limits: {fileSize: 50 * 1024 * 1024},
    createParentPath: true
}))

/** Middlewares */
app.use(morgan('dev'))

/** Rutas */
app.use('/api/admins',adminRouter)
app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)




export default app