import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDto } from '../dto/UpdateUserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

    @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  patchById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}