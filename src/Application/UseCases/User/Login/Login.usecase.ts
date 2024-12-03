import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Domain/Services/Auth.service';
import { AuthDTO } from 'src/@shared/@dtos';
import { AuthResponse } from 'src/@shared/@types/index';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(userDto: AuthDTO): Promise<AuthResponse> {
    const user = await this.authService.getBy({ name: userDto.name });
    const secretKey: string = process.env.SECRET_KEY || 'secret';

    const bytes = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_CRYPTO_KEY || 'secret',
    );

    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    user.password = cleanString(decryptedPassword);

    if (!user) {
      throw new UnauthorizedException('User not exists, verify!');
    }
    const isPasswordValid = bcrypt.compareSync(userDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password invalid, verify!');
    }

    const payload = { id: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '5h',
      secret: secretKey,
    });

    return { access_token };
  }
}
