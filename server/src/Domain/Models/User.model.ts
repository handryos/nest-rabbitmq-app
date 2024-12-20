import { Column, Table, Model, DataType } from 'sequelize-typescript';
import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({ tableName: 'Users', timestamps: false })
export class User extends Model {
  @Column({ type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
    allowNull: false })
  @Field(() => Number)
  id!: number;

  @Column({
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  @Field(() => String)
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  })
  @HideField()
  password: string;
}

export type UserUpdateModel = Omit<User, 'id'>;

export type UserModelUniqRef = Pick<User, 'name'>;
