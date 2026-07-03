import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { GetUsersDto } from './dto/get-users.dto';



@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllUsers(query: GetUsersDto) {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      isActive: true,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await this.userModel.countDocuments(filter);

    return {
      message: 'Users fetched successfully',
      page,
      limit,
      total,
      data: users,
    };
  }

  async getOneUser(id: string) {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async deactivateUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deactivated successfully',
      data: user,
    };
  }
}