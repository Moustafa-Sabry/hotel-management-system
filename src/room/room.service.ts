import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetRoomsDto } from './dto/get-rooms.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomModel.findOne({
      roomNumber: createRoomDto.roomNumber,
    });

    if (room) {
      throw new ConflictException('Room number already exists');
    }

    return await this.roomModel.create(createRoomDto);
  }

  async findAll(query: GetRoomsDto) {
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

    const rooms = await this.roomModel
      .find(filter)
      .populate('facilities')
      .skip(skip)
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

  async findOne(id: string) {
    const room = await this.roomModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate('facilities');

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
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

  async getAvailableRooms() {
    return await this.roomModel
      .find({
        isDeleted: false,
      })
      .populate('facilities');
  }

  async getRoomDetails(id: string) {
    const room = await this.roomModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate('facilities');

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}