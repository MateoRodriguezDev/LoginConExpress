import server from './server'
import Admin from './models/Admin.model';

declare global {
    namespace Express {
        interface Request {
            admin?: Admin; //Le agrego user a request
        }
    }
}

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})