import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from 'src/Domain/Services/Auth.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { AuthDTO } from 'src/@shared/@dtos';
import * as CryptoJS from 'crypto-js';

dotenv.config();

@Injectable()
export class RegisterUseCase {
  constructor(private authService: AuthService) {}

  private async hashPassword(password: string): Promise<string> {
    const SALT_FACTOR = 8;
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    return bcrypt.hash(password, salt);
  }

  async execute(userDto: AuthDTO): Promise<void> {
    let hashedPassword = await this.hashPassword(userDto.password);
    let existingUser = await this.authService.getBy({ name: userDto.name });

    const bytes = CryptoJS.AES.decrypt(
      userDto.password,
      process.env.SECRET_CRYPTO_KEY || 'secret',
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    userDto.password = decryptedPassword;

    if (existingUser) {
      throw new InternalServerErrorException(
        `User "${existingUser.name}" already exists`,
      );
    }

    await this.authService.create({
      name: userDto.name,
      password: hashedPassword,
    });
  }
}
