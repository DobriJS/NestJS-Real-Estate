import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {message: "Phone must be a valid phone"})
    phone: string;

    @IsEmail()
    email: string;

    @MinLength(5)
    @IsString()
    password: string;
}

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}