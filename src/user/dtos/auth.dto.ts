import { UserType } from "@prisma/client";
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid phone" })
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(5)
    @IsString()
    password: string;

    @IsOptional()
    productKey?: string;
}

export class SigninDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ enum: ['ADMIN', 'BUYER', 'REALTOR'] })
    @IsEnum(UserType)
    userType: UserType
}