import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review } from '../schemas/review.schema';
import { Room } from '../schemas/room.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,

    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
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

    await this.updateAverage(dto.room);

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

    await this.updateAverage(review.room.toString());

    return {
      message: 'Review deleted successfully',
    };
  }

  private async updateAverage(roomId: string) {
    const reviews = await this.reviewModel.find({
      room: roomId,
    });

    let average = 0;

    if (reviews.length) {
      average =
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        ) / reviews.length;
    }

    await this.roomModel.findByIdAndUpdate(roomId, {
      averageRating: average,
    });
  }
}