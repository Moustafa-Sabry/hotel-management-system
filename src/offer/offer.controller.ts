import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OffersService } from './offer.service';
import { CreateOfferDto } from './dto/create.offers.dto';
import { GetOffersDto } from './dto/get.offers.dto';
import { UpdateOfferDto } from './dto/update.offers.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.config';



@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) {}

  
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  addOffer(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: CreateOfferDto,
  ) {
    body.image = file.filename;
    return this.offersService.addOffer(body);
   }

  @Get()
  getAllOffers(@Query() query: GetOffersDto) {
    return this.offersService.getAllOffers(query);
  }

  @Get(':id')
  getOneOffer(@Param('id') id: string) {
    return this.offersService.getOneOffer(id);
  }

  @Put(':id')
  updateOffer(
    @Param('id') id: string,
    @Body() body: UpdateOfferDto,
  ) {
    return this.offersService.updateOffer(id, body);
  }

  @Delete(':id')
  deleteOffer(@Param('id') id: string) {
    return this.offersService.deleteOffer(id);
  }
}