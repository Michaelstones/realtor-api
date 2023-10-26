/* eslint-disable prettier/prettier */
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {UserType} from 'prisma/prisma-client'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

interface SignUp{
    name: string,
    password:string,
    email: string,
    phone: string,
    productKey?:string
}

interface SignIn{
    password:string,
    email: string,
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async  signUp({email, password, phone,name }:SignUp, userType:UserType ) {
      const userExist = await this.prismaService.user.findUnique({ where: { email: email } })
      if (userExist) {
          throw new ConflictException
      }

      const hashPassWord = await bcrypt.hash(password, 10)
      const user = await this.prismaService.user.create({
          data: {
              email,
              password: hashPassWord,
              phone,
              name,
              user_type:userType
          }
      })
     
    return await this.generateJwt(name, user.id);
  }
    
    async signIn({email,password}:SignIn) {
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) {
            throw new HttpException('Invalid Credentials', 400)
        }
        const isValidPwd = await bcrypt.compare(password, user.password)
        if (!isValidPwd) {
            throw new HttpException('Invalid Credentials', 400)
        }

       return await this.generateJwt(user.name, user.id)
    }


    private  async generateJwt(name:string, id:any) {
       return  jwt.sign({
          name:name, 
          id:id
      },process.env.JSON_TOKEN, {expiresIn:3600000})
    }

    async generateProductKey(email: string, userType: UserType) {
        const string =`${email}-${userType}-${process.env.PRODUCT_TOKEN}`
        return bcrypt.hash(string,10)
    }
}
