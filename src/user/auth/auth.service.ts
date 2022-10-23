import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { SignupParams } from 'src/interfaces/SignupParams';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { SigninParams } from 'src/interfaces/SigninParams';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }

    async signup({ email, password, phone, name }: SignupParams, userType: UserType) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        });

        if (userExists) throw new ConflictException('User with the given email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                name,
                user_type: userType
            }
        });

        return this.generateJWT(name, user.id);

    }

    async signin({ email, password }: SigninParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) throw new HttpException("Invalid credetials", 400);

        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) throw new HttpException("Invalid credetials", 400);

        return this.generateJWT(user.name, user.id);

    }

    private generateJWT(name: string, id: number) {
        return jwt.sign({
            name,
            id
        },
            process.env.JWT_KEY,
            {
                expiresIn: 8600,
            })
    }

    generateProductKey(email: string, userType: UserType) {
        const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
        return bcrypt.hash(string, 10);
    }
}
