import { Injectable, ConflictException } from '@nestjs/common';
import { SignupParams } from 'src/interfaces/Signup';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ email }: SignupParams) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        });

        if (userExists) throw new ConflictException;
    }

}
