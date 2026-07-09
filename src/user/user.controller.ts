import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { GetUsersDto } from './dto/get-users.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Query() query: GetUsersDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.usersService.getOneUser(id);
  }

  @Delete(':id')
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}