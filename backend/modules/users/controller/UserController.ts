import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { UserDTO } from '../dto/UserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {} // DI

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: UserDTO) {
    return this.usersService.create(dto);
  }

  @Patch(':id/done')
  patch(@Param('id') id: string) {

  }
}