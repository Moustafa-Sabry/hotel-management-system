import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Room, RoomDocument } from '../../schemas/room.schema';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../../schemas/booking.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async getDashboard() {
    const totalRooms = await this.roomModel.countDocuments({
      isDeleted: false,
    });

    const totalUsers = await this.userModel.countDocuments();

    const occupiedRooms = await this.bookingModel.aggregate([
      {
        $match: {status: BookingStatus.CONFIRMED,checkIn: { $lte: new Date() }, checkOut: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: '$room',
        },
      },
      {
        $count: 'count',
      },
    ]);

    const occupiedCount = occupiedRooms.length > 0 ? occupiedRooms[0].count : 0;

    const availableRooms = totalRooms - occupiedCount;

    const recentBookings = await this.bookingModel.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('room', 'roomNumber');

    return {
      statistics: {totalRooms, availableRooms, occupiedRooms: occupiedCount, totalUsers,
      },
      recentBookings,
    };
  }
}
