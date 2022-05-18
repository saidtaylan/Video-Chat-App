import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { Room } from './entities/room.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomModel } from 'src/room/room.model';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('room') private roomModeli: Model<Room>,
    private readonly roomModel: RoomModel,
    private authService: AuthService,
  ) {}

  async create(userId: string, createRoomInput: CreateRoomDto) {
    const room = await this.roomModel.insert(userId, createRoomInput);
    if (!room) {
      throw new HttpException(
        'could not create the room',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return room;
  }

  async getRooms(userId: string, type?: string) {
    if (type) {
      const rooms = await this.roomModel.findMany({ owner: userId, type })
      if (rooms.length > 0) {
        return rooms
      }
      throw new NotFoundException('could not found any room');
    }
    const rooms = await this.roomModel.findMany({ owner: userId });
    if (rooms.length > 0) return rooms
    throw new NotFoundException('could not found any room ');
  }

  async getById(id: string) {
    const room = await this.roomModel.findById(id);
    if (room) return room
    throw new NotFoundException('cannot found such a room');
  }

  async getByLink(link: string) {
    const room = await this.roomModel.findOne({ link });
    if (room) return room
    throw new NotFoundException('cannot found such a room');
  }

  async getOne(payload: {}) {
    const room = await this.roomModel.findOne(payload);
    if (room) return room
    throw new NotFoundException('cannot found such a room');
  }

  async updateRoom(id: string, updatePayload: UpdateRoomDto) {
    const updatedRoom = await this.roomModel.update(id, updatePayload);
    if (updatedRoom) {
      return updatedRoom;
    }
    throw new NotImplementedException('the room could not updated');
  }

  async deleteRoom(link: string) {
    const deletedRoom = await this.roomModel.delete(link);
    if (deletedRoom) {
      return deletedRoom;
    }
    throw new NotImplementedException('the room could not deleted');
  }

  async attendToRoom(
    link: string,
    currentUserId?: string,
    displayName?: string,
  ) {
    if (displayName) {
      const room = await this.roomModel.findOne({ link });
      if (room) {
        if (room?.permanent === true) {
          throw new HttpException(
            "You cannot attend a permanent room if you're not a registered user",
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new NotFoundException('cannot found such a room');
      }
      const tempUser = await this.userService.createTempUser({ displayName });
      if (tempUser) {
        room.participants.push(tempUser);
        room.save();
        return room;
      }
      throw new NotImplementedException('could not attend to this room');
    } else {
      const room = await this.roomModel.findOne({ link });
      if (room) {
        const user = await this.userService.getUserById(currentUserId);
        room.participants.push(user);
        room.save();
        return room;
      }
      throw new NotFoundException('cannot found such a room');
    }
  }

  async leaveRoom(link: string, currentUserId?: string, tempUserId?: string) {
    if (tempUserId) {
      const room = await this.getOne({ link });
      if (!room) {
        throw new NotFoundException('room not found');
      }
      const deletedTempUser = await this.userService.deleteTempUser(tempUserId);
      if (deletedTempUser) {
        room.participants.filter(
          (participant) => (participant._id as string) !== tempUserId,
        );
        room.save();
        return room;
      }
      throw new InternalServerErrorException(
        'an error occured when leave the room',
      );
    }
    if (currentUserId) {
      const room = await this.getOne({ link });
      if (!room) {
        throw new NotFoundException('room not found');
      }
      room.participants.filter(
        (participant) => (participant._id as string) !== currentUserId,
      );
      room.save();
      return room;
    }
  }
}
