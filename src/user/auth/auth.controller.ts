import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/signup')
    signup(@Body() body: SignupDto) {
        return this.authService.signup();
    }
}
