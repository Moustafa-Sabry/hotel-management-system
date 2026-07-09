import {Body,Controller,Delete,Get,Param,Patch,Post,Query,} from '@nestjs/common';
import {ApiBearerAuth,ApiOperation,ApiResponse,ApiTags} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetRoomDto } from './dto/get-room.dto';
import { UseGuards } from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

 @ApiOperation({
    summary: 'Get all rooms',
  })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
  })
  @Get()
  findAll(@Query() query: GetRoomDto) {
    return this.roomService.findAll(query);
  }

  // @Get('available')
  // getAvailableRooms() {
  //   return this.roomService.getAvailableRooms();
  // }

  @Get('details/:id')
  getRoomDetails(@Param('id') id: string) {
    return this.roomService.getRoomDetails(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}