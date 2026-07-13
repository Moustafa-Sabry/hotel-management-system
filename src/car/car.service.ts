import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { GetCarDto } from './dto/get-car.dto';
import { Car, CarStatus } from 'schemas/car-rental.schema';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
  ) {}

  async create(createCarDto: CreateCarDto) {
    const car = await this.carModel.findOne({
      name: createCarDto.name,
      model: createCarDto.model,
      isDeleted: false,
    });

    if (car) {
      throw new ConflictException('Car already exists');
    }

    return await this.carModel.create(createCarDto);
  }

  async findAll(query: GetCarDto) {
    const { page = 1, limit = 10, search } = query;

    const skip = (+page - 1) * +limit;

    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const cars = await this.carModel
      .find(filter)
      .skip(skip)
      .limit(+limit);

    const total = await this.carModel.countDocuments(filter);

    return {
      message: 'Cars fetched successfully',
      page: +page,
      limit: +limit,
      total,
      data: cars,
    };
  }

  async findOne(id: string) {
    const car = await this.carModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return {
      message: 'Car fetched successfully',
      data: car,
    };
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.carModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      updateCarDto,
      {
        new: true,
      },
    );

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return {
      message: 'Car updated successfully',
      data: car,
    };
  }

  async remove(id: string) {
    const car = await this.carModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return {
      message: 'Car deleted successfully',
    };
  }

  async getAvailableCars() {
    const cars = await this.carModel.find({
      status: CarStatus.AVAILABLE,
      isDeleted: false,
    });

    return {
      message: 'Available cars fetched successfully',
      data: cars,
    };
  }

  async getCarDetails(id: string) {
    const car = await this.carModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return {
      message: 'Car details fetched successfully',
      data: car,
    };
  }
}