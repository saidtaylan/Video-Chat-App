import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { Room } from './models/room.model';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('room') private roomModel: Model<Room>,
    private authService: AuthService,
  ) {}

  async create(userId: string, createRoomInput: CreateRoomDto) {
    const uniqueURL = nanoid();
    let passcode: string;
    let link: string;
    if (createRoomInput.passcode) {
      passcode = createRoomInput.passcode;
      link = `${process.env.BASE_URL}/r/${uniqueURL}`;
    } else {
      passcode = nanoid(8);
      link = `${process.env.BASE_URL}/r/${uniqueURL}`;
    }
    const hashedPass = await this.authService.hashPassword(passcode);
    console.log('createRoomInput :>> ', createRoomInput);
    const newRoom = await new this.roomModel({
      owner: userId,
      ...createRoomInput,
      link: uniqueURL,
      passcode: hashedPass,
    }).save();
    console.log('newRoom :>> ', newRoom);
    if (!newRoom) {
      throw new NotImplementedException('room cannot created');
    }
    const resp = { link, ...newRoom.toObject({ getters: true }) };
    delete resp.passcode;
    return resp;
  }

  async getRooms(userId: string, type?: string) {
    if (type) {
      const rooms = await this.roomModel
        .find({ owner: userId, type })
        .populate({
          path: 'owner',
          select: 'name lastName email role profileImage',
        })
        .populate({
          path: 'participants',
          select: 'name lastName email role profileImage',
        })
        .populate({
          path: 'hosts',
          select: 'name lastName email role profileImage',
        });
      if (rooms.length > 0) {
        const roomsResp = rooms.map((room) => {
          delete room.passcode;
          return room;
        });
        return roomsResp;
      }
      throw new NotFoundException('cannot found any room');
    }
    const rooms = await this.roomModel
      .find({ owner: userId })
      .populate({
        path: 'owner',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'participants',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'hosts',
        select: 'name lastName email role profileImage',
      });
    console.log('rooms :>> ', rooms);
    if (rooms.length > 0) {
      const roomsResp = rooms.map((room) => {
        delete room.passcode;
        return room;
      });
      return roomsResp;
    }
    throw new NotFoundException('cannot found any room');
  }

  async getById(id: string) {
    const room = await this.roomModel
      .findById(id)
      .populate({
        path: 'owner',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'participants',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'hosts',
        select: 'name lastName email role profileImage',
      })
      .lean();
    if (room) {
      delete room.passcode;
      return room;
    }
    throw new NotFoundException('cannot found such a room');
  }

  async getByLink(link: string) {
    const room = await this.roomModel
      .findOne({ link })
      .populate({
        path: 'owner',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'participants',
        select: 'name lastName email role profileImage',
      })
      .populate({
        path: 'hosts',
        select: 'name lastName email role profileImage',
      });
    if (room) {
      delete room.passcode;
      return room;
    }
    throw new NotFoundException('cannot found such a room');
  }

  async getOne(payload: {}) {
    const room = await this.roomModel.findOne(payload);
    if (room) return room;
    throw new NotFoundException('cannot found such a room');
  }

  async updateRoom(id: string, updatePayload: UpdateRoomDto) {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true },
    );
    if (updatedRoom) {
      delete updatedRoom.passcode;
      return updatedRoom;
    }
    throw new NotImplementedException('the room could not updated');
  }

  async deleteRoom(id: string) {
    const deletedRoom = await this.roomModel.findByIdAndDelete(id);
    if (deletedRoom) {
      delete deletedRoom.passcode;
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
        delete room.passcode;
        return room;
      }
      throw new NotImplementedException('could not attend to this room');
    } else {
      const room = await this.roomModel.findOne({ link });
      if (room) {
        const user = await this.userService.getUserById(currentUserId);
        room.participants.push(user);
        room.save();
        delete room.passcode;
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
        delete room.passcode;
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
      delete room.passcode;
      return room;
    }
  }
}
