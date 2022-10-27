import { UserType } from "@prisma/client";
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'Max' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "(555) 555 5542" })
    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid phone" })
    phone: string;

    @ApiProperty({ example: 'someEmail@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'somesecret1212' })
    @MinLength(5)
    @IsString()
    password: string;

    @IsOptional()
    productKey?: string;
}

export class SigninDto {
    @ApiProperty({ example: 'someEmail@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'somesecret1212' })
    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @ApiProperty({ example: 'someEmail@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: ['ADMIN', 'BUYER', 'REALTOR'] })
    @IsEnum(UserType)
    userType: UserType
}