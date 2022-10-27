import { PropertyType } from "@prisma/client"
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HomeResponseDto {
    @ApiProperty()
    @IsNumber()
    id: number;
    address: string;

    @Exclude()
    number_of_bedrooms: number;

    @Expose({ name: 'numberOfBedrooms' })
    numberOfBedrooms() {
        return this.number_of_bedrooms;
    }

    @Exclude()
    number_of_bathrooms: number;

    @Expose({ name: 'numberOfBathrooms' })
    numberOfBathrooms() {
        return this.number_of_bathrooms;
    }

    city: string;
    price: number;

    @IsOptional()
    minPrice?: string;


    @Exclude()
    listed_date: Date;

    @Expose({ name: 'listedDate' })
    listedDate() {
        return this.listedDate;
    }

    @Exclude()
    land_size: number;

    @Expose({ name: 'landSize' })
    landSize() {
        return this.landSize;
    }

    image: string;
    propertyType: PropertyType;

    @Exclude()
    created_at: Date;
    @Exclude()
    updated_at: Date;
    @Exclude()
    realtor_id: number;

    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class CreateHomeDto {
    @ApiProperty({ example: '5th Avenue ...' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 3 })
    @IsNumber()
    @IsPositive()
    numberOfBedrooms: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsPositive()
    numberOfBathrooms: number;

    @ApiProperty({ example: 'New York' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 1000000 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ example: 1200 })
    @IsNumber()
    @IsPositive()
    landSize: number;

    @ApiProperty({ enum: PropertyType })
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Image)
    images: Image[]
}

export class UpdateHomeDto {
    @ApiPropertyOptional({ example: '5th Avenue ...' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedrooms?: number;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathrooms?: number;

    @ApiPropertyOptional({ example: 'New York' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?: string;

    @ApiPropertyOptional({ example: 1000000 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @ApiPropertyOptional({ example: 2000 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize?: number;

    @ApiPropertyOptional({ enum: PropertyType })
    @IsOptional()
    @IsEnum(PropertyType)
    propertyType?: PropertyType;
}