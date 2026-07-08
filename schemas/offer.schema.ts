import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from './room.schema';
export type OfferDocument = HydratedDocument<Offer>;

@Schema({
  timestamps: true,
})
export class Offer {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  description: string;

  @Prop({
    required: true,
  })
  image: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
  })
  startDate: Date;

  @Prop({
    required: true,
  })
  endDate: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Room.name }],
    default: [],
  })
  rooms: Types.ObjectId[];
}

export const OfferSchema = SchemaFactory.createForClass(Offer);