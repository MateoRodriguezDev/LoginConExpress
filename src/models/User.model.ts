import { Model, Column, DataType, Table, HasMany } from "sequelize-typescript";
import Receipt from "./Receipt.mode";


@Table({
    tableName: 'users'
})

class User extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.STRING(),
        allowNull: false
    })
    declare email: string

    @Column({
        type: DataType.STRING(),
        allowNull: false
    })
    declare password: string


    // Relación uno a muchos: un Doctor tiene muchos Pacientes
    @HasMany(() => Receipt)
    declare receipts: Receipt[];
}



export default User