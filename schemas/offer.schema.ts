import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OfferDocument = HydratedDocument<Offer>;

@Schema({
  timestamps: true,
  versionKey: false,
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
    trim: true,
  })
  image: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);