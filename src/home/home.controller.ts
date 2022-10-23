import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PropertyType, UserType } from '.prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/interfaces/UserInfo';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { HomeService } from './home.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';


@ApiTags('home')
@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get()
    @ApiOperation({ summary: 'Fetch All Homes' })
    @ApiResponse({ status: 200, description: 'The resources has been fetched.' })
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
    getHome(@Param('id', ParseIntPipe) id: number) {
        return this.homeService.getHomeById(id);
    }

    @Roles(UserType.REALTOR)
    @Post()
    createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
        return this.homeService.createHome(body, user.id);
    }

    @Roles(UserType.REALTOR)
    @Put(':id')
    async updateHome(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateHomeDto, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) throw new UnauthorizedException();
        return this.homeService.updateHome(id, body);
    }

    @Roles(UserType.REALTOR)
    @Delete(':id')
    async deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) throw new UnauthorizedException();
        return this.homeService.deleteHomeById(id);
    }

}
