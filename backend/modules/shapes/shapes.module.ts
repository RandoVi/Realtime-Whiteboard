import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shape, ShapeSchema } from './schemas/ShapeSchema';
import { Circle, CircleSchema } from './schemas/CircleSchema';
import { Rectangle, RectangleSchema } from './schemas/RectangleSchema';
import { ShapesService } from './service/ShapesService';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shape.name,
        schema: ShapeSchema,
        discriminators: [
          { name: Circle.name, schema: CircleSchema },
          { name: Rectangle.name, schema: RectangleSchema },
        ],
      },
    ]),
  ],
  providers: [ShapesService],
  exports: [ShapesService],
})
export class ShapesModule {}