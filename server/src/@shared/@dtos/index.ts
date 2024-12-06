import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsInt, Min } from 'class-validator';

@InputType()
export class AuthDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  password: string;
}

@InputType()
export class RepositoryDTO {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  owner: string;

  @IsInt()
  @Min(0)
  @Field(() => Number)
  stars: number;
}
