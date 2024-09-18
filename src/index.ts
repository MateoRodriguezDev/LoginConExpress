import server from './server'
import { Payload } from './types';

declare global {
    namespace Express {
        interface Request {
            admin?: Payload; //Le agrego admin a request
            user?: Payload; //Le agrego user a request
        }
    }
}

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})