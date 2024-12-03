import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LoginUseCase } from 'src/Application/UseCases/User/Login/Login.usecase';
import { AuthDTO } from 'src/@shared/@dtos';
import { RegisterUseCase } from 'src/Application/UseCases/User/Register/Register.usecase';

dotenv.config();

@Controller('auth')
class AuthControler {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  async register(@Body() user: AuthDTO) {
    try {
      await this.registerUseCase.execute(user);

      return {
        message: 'User created!',
        statusCode: 201,
        user: {
          name: user.name,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating the user, verify!. ' + error,
      );
    }
  }
  @Post('login')
  async login(@Body() user: AuthDTO) {
    try {
      const result = await this.loginUseCase.execute(user);
      return {
        message: 'Ok!',
        token: result.access_token,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Invalid email or password. Verify!.',
      );
    }
  }
}
export default AuthControler;
