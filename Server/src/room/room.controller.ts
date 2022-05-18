import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OptionalJWTGuard } from 'src/auth/guards/optional-jwt.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) body: CreateRoomDto,
    @Req() req: Partial<{ user: { userId: string } }>,
  ) {
   return  await this.roomService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Body(new ValidationPipe()) body: UpdateRoomDto,
    @Param('id') id: string,
  ) {
    return await this.roomService.updateRoom(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('type') type: string,
    @Req()
    req: Partial<{ user: { userId: string; email: string; role: string } }>,
  ) {
    if (type) {
      return await this.roomService.getRooms(req.user.userId, type);
    }
    return await this.roomService.getRooms(req.user.userId);
  }

  @Get('l/:link')
  async getByLink(@Param('link') link: string) {
    return await this.roomService.getByLink(link);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.roomService.deleteRoom(id);
  }

  @UseGuards(OptionalJWTGuard)
  @Get('attend/:link')
  async join(
    @Param('link') link: string,
    @Query('display-name') displayName: string,
    @Req() req: Partial<{ user: Partial<{ userId: string }> }>,
  ) {
    if (req.user && !displayName) {
      return await this.roomService.attendToRoom(link, req.user.userId);
    } else if (displayName && !req.user) {
      return await this.roomService.attendToRoom(link, undefined, displayName);
    } else {
      throw new InternalServerErrorException(
        'cannot send displayName, if user is registered  or must be send displayName if user unregistered',
      );
    }
  }

  @Get('leave/:link')
  async leave(
    @Param('link') link: string,
    @Req() req: Partial<{ user: Partial<{ userId: string }> }>,
    @Body() body?: { tempUserId: string },
  ) {
    if (req.user && !body?.tempUserId) {
      return await this.roomService.leaveRoom(link, req.user.userId);
    } else if (body?.tempUserId && !req.user) {
      return await this.roomService.leaveRoom(link, undefined, body.tempUserId);
    } else {
      throw new InternalServerErrorException(
        'cannot send tempUserId, if user is registered or must be send tempUserId if user unregistered',
      );
    }
  }
}
