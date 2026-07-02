import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacilityDocument = HydratedDocument<Facility>;

@Schema({timestamps: true})
export class Facility {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({
    trim: true,
    default: '',
  })
  icon: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
