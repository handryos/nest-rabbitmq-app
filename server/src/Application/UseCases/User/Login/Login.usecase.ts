import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Domain/Services/Auth.service';
import { AuthDTO } from 'src/@shared/@dtos';
import { AuthResponse } from 'src/@shared/@types/index';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  public cleanString(input: string): string {
    let cleanedString = input.replace(/\\/g, '');
    cleanedString = cleanedString.replace(/^"|"$/g, '');
    return cleanedString;
  }

  async execute(userDto: AuthDTO): Promise<AuthResponse> {
    const user = await this.authService.getBy({ name: userDto.name });

    if (!user) {
      throw new UnauthorizedException('User not exists, verify!');
    }

    const secretKey: string = 'secret';

    const bytes = CryptoJS.AES.decrypt(userDto.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
 
    if (!decryptedPassword) {
      throw new UnauthorizedException('Failed to decrypt password.');
    }

    const isPasswordValid = await bcrypt.compare(this.cleanString(decryptedPassword), user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Name or password invalid, verify!');
    }

    const payload = { id: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '5h',
      secret: secretKey,
    });

    return { access_token };
  }
}