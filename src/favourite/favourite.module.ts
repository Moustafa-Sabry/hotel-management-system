import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { FavouriteSchema ,Favourite } from 'schemas/favourite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Favourite.name,
        schema: FavouriteSchema,
      },
    ]),
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService],
  exports: [FavouriteService],
})
export class FavouriteModule {}

