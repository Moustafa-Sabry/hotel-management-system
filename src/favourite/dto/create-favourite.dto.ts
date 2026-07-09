import { IsMongoId } from 'class-validator';

export class CreateFavouriteDto {
  @IsMongoId()
  room: string;
}