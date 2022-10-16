import { Body, Controller, Post, Param, ParseEnumPipe, UnauthorizedException, Get } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup/:userType')
    async signup(@Body() body: SignupDto, @Param('userType', new ParseEnumPipe(UserType)) userType: UserType) {

        if (userType !== UserType.BUYER) {
            if (!body.productKey) throw new UnauthorizedException();

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);
            if (!isValidProductKey) throw new UnauthorizedException();
        }
        return this.authService.signup(body, userType);
    }

    @Post('/signin')
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }

    @Post('/key')
    generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
        return this.authService.generateProductKey(email, userType)
    }

    @Get('/me')
    me(@User() user: UserInfo) {
        return user;
    }
}
