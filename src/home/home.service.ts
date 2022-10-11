import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeParams } from 'src/interfaces/CreateHomeParams';
import { GetHomesParam } from 'src/interfaces/GetHomesParam';
import { UpdateHomeParams } from 'src/interfaces/UpdateHomeParams';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

const homeSelect = {
    id: true,
    address: true,
    city: true,
    price: true,
    propertyType: true,
    number_of_bathrooms: true,
    number_of_bedrooms: true,
}

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

    async getHomeById(id: number) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id,
            },
            select: {
                ...homeSelect,
                images: {
                    select: {
                        url: true,
                    },
                },
                realtor: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        if (!home) throw new NotFoundException();
        return new HomeResponseDto(home);
    }

    async createHome({ address, city, numberOfBathrooms, numberOfBedrooms, landSize, price, propertyType, images }: CreateHomeParams) {
        const home = await this.prismaService.home.create({
            data: {
                address,
                city,
                land_size: landSize,
                price,
                propertyType,
                number_of_bathrooms: numberOfBathrooms,
                number_of_bedrooms: numberOfBedrooms,
                realtor_id: 7,
            }
        })

        const homeImages = images.map((image) => ({ ...image, home_id: home.id }));
        await this.prismaService.image.createMany({ data: homeImages });

        return new HomeResponseDto(home);
    }

    async updateHome(id: number, data: UpdateHomeParams) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id,
            }
        });

        if (!home) throw new NotFoundException();

        const updatedHome = await this.prismaService.home.update({
            where: {
                id
            },
            data
        });

        return new HomeResponseDto(updatedHome)
    }

    async deleteHomeById(id: number) {
        await this.prismaService.image.deleteMany({
            where: {
                home_id: id
            }
        });

        await this.prismaService.home.delete({
            where: {
                id,
            }
        });
    }
}
