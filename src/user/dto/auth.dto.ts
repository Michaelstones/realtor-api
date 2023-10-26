/* eslint-disable prettier/prettier */
import { UserType } from '@prisma/client';
import { IsEmail, IsNotEmpty, Matches, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
    name: string;
    
  @Matches(/^\+[1-9]\d{10,14}$/, {
    message: 'phone must be a valid phone number',
  })
      
  phone: string;
  @IsEmail()
  email: string;
    
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}


export class SignInDto {
     
  phone: string;
  @IsEmail()
  email: string;
    
   @IsString()
  @IsNotEmpty()
  password: string;
}

export class generateProductKeyDTO {
     
  @IsEmail()
  email: string;
    
  @IsEnum(UserType)
  userType:UserType
}
