import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, generateProductKeyDTO } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    // console.log(userType);
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_TOKEN}`;
      const isValidKey = await bcrypt.compare(validProductKey, body.productKey);
      if (!isValidKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signUp(body, userType);
  }
  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  generateProductKey(@Body() { email, userType }: generateProductKeyDTO) {
    return this.authService.generateProductKey(email, userType);
  }
}
