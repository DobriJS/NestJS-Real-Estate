import { Controller, Get, Post } from '@nestjs/common';
import { HomeResponseDto } from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    @Get()
    getHomes(): Promise<HomeResponseDto[]> {
        return this.homeService.getHomes();
    }
}
