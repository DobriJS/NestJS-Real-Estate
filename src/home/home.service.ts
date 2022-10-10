import { Injectable, NotFoundException } from '@nestjs/common';
import { GetHomesParam } from 'src/interfaces/GetHomesParam';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService) { }

    async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                id: true,
                address: true,
                city: true,
                price: true,
                propertyType: true,
                number_of_bathrooms: true,
                number_of_bedrooms: true,
                images: {
                    select: {
                        url: true,
                    },
                    take: 1
                },
            },
            where: filter,
        });

        if (!homes.length) {
            throw new NotFoundException();
        }

        return homes.map(
            (home) => {
                const fetchHome = { ...home, image: home.images[0].url };
                delete fetchHome.images
                return new HomeResponseDto(fetchHome)
            }
        )
    }
}
