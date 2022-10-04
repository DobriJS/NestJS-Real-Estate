import { Injectable, ConflictException } from '@nestjs/common';
import { SignupParams } from 'src/interfaces/Signup';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ email, password, phone, name }: SignupParams) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        });

        if (userExists) throw new ConflictException();

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.user.create({
           data: {
            email,
            password: hashedPassword,
            phone,
            name,
            user_type: UserType.BUYER
           }
        });

        const token = jwt.sign({
            name,
            id: user.id
        }, process.env.JSON_KEY, {
            expiresIn: 8600
        })

        return {token};
    }
}
