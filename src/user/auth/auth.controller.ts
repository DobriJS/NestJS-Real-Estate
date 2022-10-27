import { Body, Controller, Post, Param, ParseEnumPipe, UnauthorizedException, Get } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../decorators/user.decorator';
import { UserInfo } from 'src/interfaces/UserInfo';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup/:userType')
    @ApiQuery({ name: 'userType', enum: UserType })
    @ApiCreatedResponse({ description: 'Successful operation' })
    @ApiConflictResponse({ description: 'User with the given email already exists' })
    @ApiOperation({ summary: 'Create new User' })
    async signup(@Body() body: SignupDto, @Param('userType', new ParseEnumPipe(UserType)) userType: UserType) {

        if (userType !== UserType.BUYER) {
            if (!body.productKey) {
                throw new UnauthorizedException();
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if (!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }

        return this.authService.signup(body, userType);
    }

    @Post('/signin')
    @ApiCreatedResponse({ description: 'Successful operation' })
    @ApiBadRequestResponse({ description: 'Invalid username/password supplied' })
    @ApiOperation({ summary: 'Login User' })
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }

    @Post('/key')
    @ApiOperation({ summary: 'Generate Product Key' })
    generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
        return this.authService.generateProductKey(email, userType)
    }

    @Get('/me')
    @ApiOperation({ summary: 'Get User Info' })
    me(@User() user: UserInfo) {
        return user;
    }
}
