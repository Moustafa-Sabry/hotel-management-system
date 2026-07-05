import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Room } from './room.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
    required: true,
  })
  room!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rating!: number;

  @Prop({
    trim: true,
    default: '',
  })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Prevent one review per user per room
ReviewSchema.index(
  { user: 1, room: 1 },
  { unique: true },
);