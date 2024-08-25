import express from 'express'
import cors from 'cors'
import colors from 'colors'
import db from './config/db'
import userRouter from './routes'

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({}))

app.use('/api/users',userRouter)

export default app