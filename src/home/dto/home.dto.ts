/* eslint-disable prettier/prettier */
import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  price: number;
  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBedrooms() {
    return this.number_of_bathrooms;
  }
  image: string;
  @Exclude()
  number_of_rooms: number;
  @Expose({ name: 'numberOfRooms' })
  numberOfRooms() {
    return this.number_of_rooms;
  }
  city: string;
  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }
  address: string;
  propertyType: PropertyType;
  home_id: number;
  @Exclude()
  created_at: Date;
  @Exclude()
  update_at: Date;
  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
