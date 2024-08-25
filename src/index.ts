import server from './server'
import User from './models/User.model';

declare global {
    namespace Express {
        interface Request {
            user?: User; //Le agrego user a request
        }
    }
}

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})