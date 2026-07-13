import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Facility } from './facility.schema';
import { RoomStatus } from 'src/common/enums/room-status.enum';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  roomNumber: string;

  @Prop({
    required: true,
    min: 1,
  })
  capacity: number;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    default: 0,
    min: 0,
    max: 100,
  })
  discount: number;

  @Prop({
    trim: true,
    default: '',
  })
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Facility.name }],
    default: [],
  })
  facilities: Types.ObjectId[];

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  averageRating: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({
  enum: RoomStatus,
  default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ price: 1 });
RoomSchema.index({ averageRating: -1 });
RoomSchema.index({ status: 1 });