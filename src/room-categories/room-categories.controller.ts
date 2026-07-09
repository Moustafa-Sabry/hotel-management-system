import {Body,Controller,Delete,Get,Param,Patch,Post,Query,UseGuards,} from '@nestjs/common';
import {ApiBearerAuth,ApiOperation,ApiResponse,ApiTags} from '@nestjs/swagger';
import { RoomCategoriesService } from './room-categories.service';
import { CreateRoomCategoryDto } from './dtos/create-room-category.dto';
import { UpdateRoomCategoryDto } from './dtos/update-room-category.dto';
import { GetRoomCategoryDto } from './dtos/get-room-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Room Categories')

@Controller('categories')

export class RoomCategoriesController {

  constructor(
    private readonly roomCategoriesService: RoomCategoriesService,) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create room category',
  })

  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(
    @Body() createDto: CreateRoomCategoryDto,) {return this.roomCategoriesService.create(createDto);}

  @ApiOperation({
    summary: 'Get all room categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @Get()
  findAll(
    @Query() query: GetRoomCategoryDto,) {return this.roomCategoriesService.findAll(query);}

  @ApiOperation({
    summary: 'Get single room category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
  })
  @Get(':id')
  findOne(
    @Param('id') id: string,) {return this.roomCategoriesService.findOne(id);}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update room category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string,@Body() updateDto: UpdateRoomCategoryDto,) {
    return this.roomCategoriesService.update(
      id,
      updateDto,
    );
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete room category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove( @Param('id') id: string,) {
    return this.roomCategoriesService.remove(id);
  }

}