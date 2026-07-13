import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

export enum CarStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Car {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  brand: string;

  @Prop({
    required: true,
    trim: true,
  })
  model: string;

  @Prop({
    required: true,
    min: 2000,
  })
  year: number;

  @Prop({
    required: true,
    min: 0,
  })
  pricePerDay: number;

  @Prop({
    required: true,
    min: 1,
  })
  seats: number;

  @Prop({
    required: true,
    enum: ['Automatic', 'Manual'],
  })
  transmission: string;

  @Prop({
    required: true,
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  })
  fuelType: string;

  @Prop({
    default: '',
    trim: true,
  })
  description: string;

  @Prop({
    default: '',
  })
  image: string;

  @Prop({
    enum: CarStatus,
    default: CarStatus.AVAILABLE,
  })
  status: CarStatus;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.index({ brand: 1 });
CarSchema.index({ model: 1 });
CarSchema.index({ pricePerDay: 1 });
CarSchema.index({ status: 1 });