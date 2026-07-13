import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { GetCarDto } from './dto/get-car.dto';
import { carMulterOptions } from 'src/common/multer/car-multer.config';



@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', carMulterOptions))
  async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCarDto.image = file.filename;
    }

    return this.carService.create(createCarDto);
  }

  @Get()
  findAll(@Query() query: GetCarDto) {
    return this.carService.findAll(query);
  }

  @Get('available')
  getAvailableCars() {
    return this.carService.getAvailableCars();
  }

  @Get('details/:id')
  getCarDetails(@Param('id') id: string) {
    return this.carService.getCarDetails(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', carMulterOptions))
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCarDto.image = file.filename;
    }

    return this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}