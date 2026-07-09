import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Favourite } from '../schemas/favourite.schema';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name)
    private readonly favouriteModel: Model<Favourite>,
  ) {}

  async create(userId: string, dto: CreateFavouriteDto) {
    const exists = await this.favouriteModel.findOne({
      user: userId,
      room: dto.room,
    });

    if (exists) {
      throw new BadRequestException(
        'Room already in favourites',
      );
    }

    return await this.favouriteModel.create({
      user: userId,
      room: dto.room,
    });
  }

  async findMyFavourites(userId: string) {
    return await this.favouriteModel
      .find({ user: userId })
      .populate('room');
  }

  async remove(userId: string, roomId: string) {
    const favourite = await this.favouriteModel.findOne({
      user: userId,
      room: roomId,
    });

    if (!favourite) {
      throw new NotFoundException(
        'Favourite not found',
      );
    }

    await this.favouriteModel.deleteOne({
      _id: favourite._id,
    });

    return {
      message: 'Favourite removed successfully',
    };
  }
}