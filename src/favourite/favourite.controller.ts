import {Body,Controller, Delete, Get,Param,Post, Req,UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import type { FavouriteRequest } from './interfaces/FavouriteRequest';

@UseGuards(JwtAuthGuard)
@Controller('favourites')

export class FavouriteController {
  constructor(
    private readonly favouriteService: FavouriteService,
  ) {}

  @Post()
  create(
    @Req() req: FavouriteRequest,
    @Body() dto: CreateFavouriteDto,
  ) {
    return this.favouriteService.create(
      req.user._id.toString(),
      dto,
    );
  }

  @Get()
  getMyFavourites(@Req() req: FavouriteRequest) {
    return this.favouriteService.findMyFavourites(
      req.user._id.toString(),
    );
  }

  @Delete(':roomId')
  remove(
    @Req() req: FavouriteRequest,
    @Param('roomId') roomId: string,
  ) {
    return this.favouriteService.remove(
      req.user._id.toString(),
      roomId,
    );
  }
}