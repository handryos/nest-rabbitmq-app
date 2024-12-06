import { Field, ObjectType } from '@nestjs/graphql';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@ObjectType()
@Table({
  tableName: 'Repositories',
  timestamps: true,
})
export class Repository extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
    allowNull: false 
  })
  id!: number;

  @Field(() => String)
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name!: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string;

  @Field(() => String)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stars!: number;
}

export type RepositoryUpdateModel = Omit<Repository, 'id'>;

export type RepositoryModelUniqRef =
  | Pick<Repository, 'id'>
  | Pick<Repository, 'name'>;
