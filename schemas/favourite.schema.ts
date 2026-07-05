import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Room } from './room.schema';

export type FavouriteDocument = HydratedDocument<Favourite>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Favourite {
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
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);

// Prevent duplicate favourites
FavouriteSchema.index(
  { user: 1, room: 1 },
  { unique: true },
);