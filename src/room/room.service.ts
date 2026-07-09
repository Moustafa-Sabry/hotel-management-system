import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetRoomDto } from './dto/get-room.dto';

@Injectable()
export class RoomService {constructor(@InjectModel(Room.name)private readonly roomModel: Model<Room>) {}

  async create(createRoomDto: CreateRoomDto) {

    const room = await this.roomModel.findOne({
      roomNumber: createRoomDto.roomNumber,
    });

    if (room) {
      throw new ConflictException('Room number already exists');
    }

    return await this.roomModel.create(createRoomDto);
  }

  async findAll(query: GetRoomDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
const filter: any = {
  isDeleted: false,
};

if (query.search) {
  filter.roomNumber = {
    $regex: query.search,
    $options: 'i',
  };
}

if (query.capacity) {
  filter.capacity = Number(query.capacity);
}

if (query.minPrice || query.maxPrice) {
  filter.price = {};

  if (query.minPrice) {
    filter.price.$gte = Number(query.minPrice);
  }

  if (query.maxPrice) {
    filter.price.$lte = Number(query.maxPrice);
  }
}

if (query.rating) {
  filter.averageRating = {
    $gte: Number(query.rating),
  };
}

if (query.facility) {
  filter.facilities = query.facility;
}
   

    const rooms = await this.roomModel
      .find(filter)
      .populate('facilities')
      .skip(skip)
      .lean()
      .limit(limit);

    const total = await this.roomModel.countDocuments(filter);

    return {
      data: rooms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {


  if (updateRoomDto.roomNumber) {
    const existing = await this.roomModel.findOne({
      roomNumber: updateRoomDto.roomNumber,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ConflictException(
        'Room number already exists',
      );
    }
  }
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      updateRoomDto,
      {
        new: true,
      },
    );

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async remove(id: string) {
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return {
      message: 'Room deleted successfully',
    };
  }

  // async getRoomDetails(id: string) {
  //   const room = await this.roomModel
  //     .findOne({
  //       _id: id,
  //       isDeleted: false,
  //     })
  //     .populate('facilities');

  //   if (!room) {
  //     throw new NotFoundException('Room not found');
  //   }

  //   return room;
  // }

  
  // async findOne(id: string) {
  //   const room = await this.roomModel
  //     .findOne({
  //       _id: id,
  //       isDeleted: false,
  //     })
  //     .populate('facilities');

  //   if (!room) {
  //     throw new NotFoundException('Room not found');
  //   }

  //   return room;
  // }


private async findRoomById(id: string) {
  const room = await this.roomModel
    .findOne({
      _id: id,
      isDeleted: false,
    })
    .populate('facilities')
    .lean();
  if (!room) {
    throw new NotFoundException('Room not found');
  }

  return room;
}

async findOne(id: string) {
  return this.findRoomById(id);
}

async getRoomDetails(id: string) {
  return this.findRoomById(id);
}
}