import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Room } from './room.schema';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Schema({
  timestamps: true,
})
export class Booking {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Room.name,
    required: true,
  })
  room: Types.ObjectId;

  @Prop({
    required: true,
  })
  checkIn: Date;

  @Prop({
    required: true,
  })
  checkOut: Date;

  @Prop({
    required: true,
    min: 0,
  })
  totalPrice: number;

  @Prop({
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop({
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);