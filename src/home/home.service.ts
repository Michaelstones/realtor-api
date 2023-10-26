import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface QueryFilter {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllHomes(filters: QueryFilter): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        price: true,
        city: true,
        address: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_rooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });
    if (!homes.length) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }

  async getHomeById(id) {
    const home = await this.prismaService.home.findUnique({
      where: id.tostring(),
    });
    if (!home) {
      throw new NotFoundException();
    }
    return new HomeResponseDto(home);
  }

  createHome() {
    return {};
  }
  updateHome() {
    return {};
  }
  deleteHome() {
    return '';
  }
}
