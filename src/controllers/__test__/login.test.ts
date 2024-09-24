import request from 'supertest';
import dotenv from 'dotenv'
import app from '../../server';
import db from '../../config/db';
import { generateToken, hashPassword } from '../../helpers';
import User from '../../models/User.model';

dotenv.config()
let tokenAdmin : string
let tokenUser : string

beforeAll(async () => {
    // Conectamos a la base de datos antes de testear
    await db.authenticate();
    await db.sync();

    //Creo un usuario normal
    await User.create({
        name: 'user',
        email: 'user@user.com',
        password: await hashPassword('password')
    })
});

afterAll(async () => {
    await db.close();
});

describe('POST /api/auth/login', () => {
    it('should display express-validator errors', async () => {
        const response = await request(app)
            .post(`/api/auth/login`)
            .send({})


        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')

        expect(response.status).not.toBe(200)
    })

    it('should display wrong email or password (email)', async () => {
        const response = await request(app)
            .post(`/api/auth/login`)
            .send({
                email: 'asdf@asdf.com',
                password: 'password1'
            })


        expect(response.status).toBe(401)
        expect(response.text).toBe('Correo o Contraseña incorrectos')

        expect(response.status).not.toBe(200)
    })

    it('should display wrong email or password (password)', async () => {
        const response = await request(app)
            .post(`/api/auth/login`)
            .send({
                email: 'user@user.com',
                password: 'asdfasdf1'
            })


        expect(response.status).toBe(401)
        expect(response.text).toBe('Correo o Contraseña incorrectos')

        expect(response.status).not.toBe(200)
    })

    it('should login you to the app', async () => {
        const response = await request(app)
            .post(`/api/auth/login`)
            .send({
                email: 'user@user.com',
                password: 'password'
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')

        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
        expect(response.text).not.toBe('Correo o Contraseña incorrectos')
    })
})