import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetRoomDto } from './dto/get-room.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a room',
  })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid room data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 409,
    description: 'Room number already exists',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @ApiOperation({
    summary: 'Get all rooms',
    description: 'Get rooms with pagination, filtering, searching and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: '101',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    example: 1000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    example: 5000,
  })
  @ApiQuery({
    name: 'capacity',
    required: false,
    example: 2,
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    example: 4,
  })
  @ApiQuery({
    name: 'facility',
    required: false,
    example: '665f3a8c2c1b4a0012345678',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    example: '665f3a8c2c1b4a0012345678',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'capacity', 'averageRating', 'createdAt'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
  })
  @Get()
  findAll(@Query() query: GetRoomDto) {
    return this.roomService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get room details',
  })
  @ApiResponse({
    status: 200,
    description: 'Room details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @Get('details/:id')
  getRoomDetails(@Param('id') id: string) {
    return this.roomService.getRoomDetails(id);
  }

  @ApiOperation({
    summary: 'Get room by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Room retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update room',
  })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Room number already exists',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete room',
  })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
