import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class RepositoryDTO {
  @ApiProperty({ example: 'nestjs', description: 'The name of the repository' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'nestjs',
    description: 'The owner of the repository',
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    example: 100,
    description: 'The number of stars of the repository',
  })
  @IsInt()
  @Min(0)
  stars: number;
}
