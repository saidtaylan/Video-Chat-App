import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/room/entities/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthService } from 'src/auth/auth.service';
import { nanoid } from 'nanoid';

@Injectable()
export class RoomModel {
  constructor(
    @InjectModel('room') private roomEntity: Model<Room>,
    private readonly authService: AuthService,
  ) {}

  async findOne(payload: {}) {
    return await this.roomEntity
      .findOne({ payload })
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
  }

  async findById(id: string) {
    return await this.roomEntity
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
      });
  }

  async findMany(payload: {}) {
    return await this.roomEntity
      .find(payload)
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
  }

  async insert(userId: string, userInput: CreateRoomDto) {
    let passcode: string;
    const link = nanoid(16);
    if (userInput.passcode) {
      passcode = userInput.passcode;
    } else {
      passcode = nanoid(8);
    }
    passcode = await this.authService.hashPassword(userInput.passcode);
    return await new this.roomEntity({
      ...userInput,
      link,
      passcode,
      owner: userId,
    }).save();
  }

  async update(link: string, userInput: UpdateRoomDto) {
    if (userInput.passcode) {
      const passcode = this.authService.hashPassword(userInput.passcode);
      return await this.roomEntity.findByIdAndUpdate(
        link,
        { userInput, passcode },
        { new: true },
      );
    }
    return await this.roomEntity.findByIdAndUpdate(link, userInput, {
      new: true,
    });
  }

  async delete(link: string) {
    const room = await this.roomEntity.findOne({ link });
    if (room.permanent)
      return await this.roomEntity.findByIdAndUpdate(room._id, {
        deleted_at: new Date().getTime(),
      });
    return await this.roomEntity.findByIdAndRemove(room._id);
  }
}
