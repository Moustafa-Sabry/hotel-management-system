import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomCategory } from 'schemas/room-categories.schema';
import { CreateRoomCategoryDto } from './dtos/create-room-category.dto';
import { UpdateRoomCategoryDto } from './dtos/update-room-category.dto';
import { GetRoomCategoryDto } from './dtos/get-room-category.dto';

@Injectable()
export class RoomCategoriesService {
  constructor(
    @InjectModel(RoomCategory.name)
    private readonly categoryModel: Model<RoomCategory>,
  ) {}
  async create(createDto: CreateRoomCategoryDto) {
    const exists = await this.categoryModel.findOne({
      name: createDto.name,
      isDeleted: false,
    });

    if (exists) {
      throw new ConflictException('Category already exists');
    }

    return this.categoryModel.create(createDto);
  }

  async findAll(query: GetRoomCategoryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }
    if (query.name) {
      filter.name = {
        $regex: query.name,
        $options: 'i',
      };
    }
    if (query.createdAfter || query.createdBefore) {
      filter.createdAt = {};

      if (query.createdAfter) {
        filter.createdAt.$gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        filter.createdAt.$lte = new Date(query.createdBefore);
      }
    }
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const categories = await this.categoryModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.categoryModel.countDocuments(filter);
    return {
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .lean();

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateDto: UpdateRoomCategoryDto) {
    if (updateDto.name) {
      const exists = await this.categoryModel.findOne({
        name: updateDto.name,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (exists) {
        throw new ConflictException('Category already exists');
      }
    }

    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Category deleted successfully',
    };
  }
}
