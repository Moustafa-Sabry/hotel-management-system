import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favourite } from 'schemas/favourite.schema';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Room } from 'schemas/room.schema';
import { MongoServerError } from 'mongodb';

@Injectable()

export class FavouriteService {
  constructor (@InjectModel(Favourite.name)private readonly favouriteModel: Model<Favourite>,
@InjectModel(Room.name)private readonly RoomModel: Model<Room>) {}

  async create(userId: string, dto: CreateFavouriteDto) {


const room = await this.RoomModel.findOne({_id:dto.room , isDeleted:false})

 if(!room) { throw new NotFoundException("room is not found ..")}

    const existsInFav = await this.favouriteModel.findOne({
      user: userId,
      room: dto.room,
    });

    if (existsInFav) {
      throw new BadRequestException(
        'Room already in favourites',
      );
    }
try{
    return await this.favouriteModel.create({
      user: userId,
      room: dto.room,
    });
  }
   catch (error) {
  if (error instanceof MongoServerError && error.code === 11000) {
    throw new ConflictException('Room already exists in favourites');
  }

  throw error;
}
  }


  async findMyFavourites(userId: string) {
    return await this.favouriteModel
      .find({ user: userId })
      .populate({path: 'room',select: 'roomNumber price images rating facilities'});
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