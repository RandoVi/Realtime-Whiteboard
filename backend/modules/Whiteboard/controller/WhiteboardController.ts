import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { WhiteboardService } from '../service/WhiteboardService';
import { CreateWhiteboardDTO } from '../dto/CreateWhiteboardDTO';
import { UpdateWhiteboardDTO } from '../dto/UpdateWhiteboardDTO';

@Controller('Whiteboard')
export class WhiteboardController {
  constructor(private readonly WhiteboardService: WhiteboardService) {}

  @Post()
  create(@Body() data: CreateWhiteboardDTO) {
    return this.WhiteboardService.create(data);
  }

    @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.WhiteboardService.findOneById(id);
  }

  @Get()
  findAll() {
    return this.WhiteboardService.findAll();
  }

  @Patch(':id')
  patchById(@Param('id') id: string, @Body() data: UpdateWhiteboardDTO) {
    return this.WhiteboardService.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.WhiteboardService.deleteById(id);
  }
}