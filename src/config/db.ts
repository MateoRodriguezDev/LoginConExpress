import { Sequelize } from "sequelize-typescript";

const db = new Sequelize('mysql://root:root@localhost:3306/login_users',{
    models: [__dirname + '/../models/**/*'],
    logging: false
})

export default db