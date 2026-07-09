import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facility } from '../schemas/facility.schema';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name)
    private readonly facilityModel: Model<Facility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto) {
    const facility = await this.facilityModel.findOne({
      name: createFacilityDto.name,
    });

    if (facility) {
      throw new ConflictException('Facility already exists');
    }

    return await this.facilityModel.create(createFacilityDto);
  }

  async findAll() {
    return await this.facilityModel.find();
  }

  async findOne(id: string) {
    const facility = await this.facilityModel.findById(id);

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return facility;
  }

  async update(id: string, updateFacilityDto: UpdateFacilityDto) {
    const facility = await this.facilityModel.findByIdAndUpdate(
      id,
      updateFacilityDto,
      { new: true },
    );

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return facility;
  }

  async remove(id: string) {
    const facility = await this.facilityModel.findByIdAndDelete(id);

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return {
      message: 'Facility deleted successfully',
    };
  }
}
