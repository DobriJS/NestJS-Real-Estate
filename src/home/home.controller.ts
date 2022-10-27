import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { PropertyType, UserType } from '.prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/interfaces/UserInfo';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { HomeService } from './home.service';
import { ApiTags, ApiQuery, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';


@ApiTags('home')
@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get()
    @ApiOkResponse({ description: 'Successful operation' })
    @ApiNotFoundResponse({ description: 'Cannot find the requested resource' })
    @ApiOperation({ summary: 'Fetch All Homes' })
    @ApiQuery({ name: 'city', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'maxPrice', required: false })
    @ApiQuery({ name: 'propertyType', required: false })
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('propertyType') propertyType?: PropertyType
    ): Promise<HomeResponseDto[]> {

        const price = minPrice || maxPrice ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
        } : undefined;

        const filters = {
            ...(city && { city }),
            ...(price && { price }),
            ...(propertyType && { propertyType }),
        }
        return this.homeService.getHomes(filters);
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Successful operation' })
    @ApiNotFoundResponse({ description: 'Cannot find the requested resource' })
    @ApiOperation({ summary: 'Fetch Home by specific id' })
    getHome(@Param('id', ParseIntPipe) id: number) {
        return this.homeService.getHomeById(id);
    }

    @Roles(UserType.REALTOR)
    @Post()
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Successful operation' })
    @ApiOperation({ summary: 'Create new Home' })
    createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
        return this.homeService.createHome(body, user.id);
    }

    @Roles(UserType.REALTOR)
    @Put(':id')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Successful operation' })
    @ApiNotFoundResponse({ description: 'Cannot find the requested resource' })
    @ApiOperation({ summary: 'Update Home' })
    async updateHome(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateHomeDto, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) throw new UnauthorizedException();
        return this.homeService.updateHome(id, body);
    }

    @Roles(UserType.REALTOR)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse({ description: 'Cannot find the requested resource' })
    @ApiOperation({ summary: 'Delete Home' })
    async deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) throw new UnauthorizedException();
        return this.homeService.deleteHomeById(id);
    }

}
