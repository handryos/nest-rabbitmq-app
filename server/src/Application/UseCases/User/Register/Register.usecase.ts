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

public cleanString(input: string): string {
    let cleanedString = input.replace(/\\/g, '');
    cleanedString = cleanedString.replace(/^"|"$/g, '');
    return cleanedString;
  }

async execute(userDto: AuthDTO): Promise<void> {
  const existingUser = await this.authService.getBy({ name: userDto.name });

  if (existingUser) {
    throw new InternalServerErrorException(
      `User "${existingUser.name}" already exists`,
    );
  }

  const secretKey = 'secret'; 
  const bytes = CryptoJS.AES.decrypt(userDto.password, secretKey);
  const decryptedPassword = this.cleanString(bytes.toString(CryptoJS.enc.Utf8));

  if (!decryptedPassword) {
    throw new InternalServerErrorException('Failed to decrypt password.');
  }

  await this.authService.create({
    name: userDto.name,
    password: decryptedPassword,
  });
}
}
