import {BadRequestException,Injectable,NotFoundException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types } from 'mongoose';

import { Review } from '../schemas/review.schema';
import { Room } from '../schemas/room.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
   @InjectModel(Review.name)private readonly reviewModel: Model<Review>,
   @InjectModel(Room.name)private readonly roomModel: Model<Room>,) {}






  async create(userId: string, dto: CreateReviewDto) {
const room = await this.roomModel.findOne({_id: dto.room , isDeleted:false })
if (!room) {
  throw new NotFoundException(" room is not found >>")
}
const exists = await this.reviewModel.findOne({
      user: userId,
      room: dto.room,
    });

  if (exists) {
      throw new BadRequestException(
        'You already reviewed this room',
      );
    }

    const review = await this.reviewModel.create({
      ...dto,
      user: userId,
    });

    await this.updateAverageRating(dto.room);

    return review;
  }




  async getRoomReviews(roomId: string) {
    return this.reviewModel
      .find({ room: roomId })
      .populate('user', 'name');
  }




  async remove(id: string, userId: string) {
    const review = await this.reviewModel.findOne({
      _id: id,
      user: userId,
    });

    if (!review) {
      throw new NotFoundException(
        'Review not found',
      );
    }

    await this.reviewModel.deleteOne({
      _id: id,
    });

    await this.updateAverageRating(review.room.toString());

    return {
      message: 'Review deleted successfully',
    };
  }




private async updateAverageRating(roomId: string) {
  const result = await this.reviewModel.aggregate([
    {
      $match: {
        room: new Types.ObjectId(roomId),
      },
    },
    {
      $group: {
        _id: '$room',
        averageRating: {
          $avg: '$rating',
        },
      },
    },
  ]);

  await this.roomModel.findByIdAndUpdate(roomId, {
    averageRating:
      result.length > 0 ? result[0].averageRating : 0,
  });
}





async update(
  id: string,
  userId: string,
  dto: UpdateReviewDto,
) {
  const review = await this.reviewModel.findOne({
    _id: id,
    user: userId,
  });

  if (!review) {
    throw new NotFoundException('Review not found');
  }

  await this.reviewModel.updateOne(
    { _id: id },
    dto,
  );

  await this.updateAverageRating(
    review.room.toString(),
  );

  return this.reviewModel.findById(id);
}



}



  
