import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomCategoryDocument = HydratedDocument<RoomCategory>;

@Schema({
  timestamps: true,
})
export class RoomCategory {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;
  @Prop({
    trim: true,
    default: '',
  })
  description: string;
  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const RoomCategorySchema = SchemaFactory.createForClass(RoomCategory);
RoomCategorySchema.index({
  name: 1,
});

RoomCategorySchema.index({
  isDeleted: 1,
});

RoomCategorySchema.index({
  createdAt: -1,
});
RoomCategorySchema.index({
  isDeleted: 1,
  createdAt: -1,
});
