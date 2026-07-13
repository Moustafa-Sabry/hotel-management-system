import { Module } from '@nestjs/common';
import { RoomCategoriesController } from './room-categories.controller';
import { RoomCategoriesService } from './room-categories.service';
import { RoomCategory, RoomCategorySchema } from 'schemas/room-categories.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
   imports: [MongooseModule.forFeature([{name: RoomCategory.name,schema: RoomCategorySchema,},]),],
  controllers: [RoomCategoriesController],
  providers: [RoomCategoriesService]
})
export class RoomCategoriesModule {}
