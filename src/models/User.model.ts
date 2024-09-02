import { Model, Column, DataType, Table } from "sequelize-typescript";


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
        type: DataType.STRING(20),
        allowNull: false
    })
    declare email: string

    @Column({
        type: DataType.STRING(),
        allowNull: false
    })
    declare password: string

    @Column({
        type: DataType.STRING(),
        allowNull: true
    })
    declare profileIMG: string
}

export default User