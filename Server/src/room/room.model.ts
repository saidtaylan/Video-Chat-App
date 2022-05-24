import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Room} from 'src/room/entities/room.entity';
import {UpdateRoomDto} from './dto/update-room.dto';
import {AuthService} from 'src/auth/auth.service';
import {nanoid} from 'nanoid';
import {UserModel} from "../user/user.model";

@Injectable()
export class RoomModel {
    constructor(
        @InjectModel('room') private roomEntity: Model<Room>,
        private readonly authService: AuthService,
        private readonly userModel: UserModel
    ) {
    }

    async findOne(payload: {}) {
        const room = await this.roomEntity
            .findOne({payload})
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
        room.passcode = this.authService.decrypt(room.passcode)
        return room
    }

    async findById(id: string) {
        const room = await this.roomEntity
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
        room.passcode = this.authService.decrypt(room.passcode)
        return room
    }

    async findMany(payload: {}) {
        const rooms = await this.roomEntity
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
        return rooms.map(room => {
            room.passcode = this.authService.decrypt(room.passcode)

            return room
        })
    }

    async insert(userId: string) {
        const link = nanoid(25);
        const passcodeOriginal = nanoid(8);
        const passcode = this.authService.encrypt({passcodeOriginal});
        const newRoom = await new this.roomEntity({
            link,
            passcode,
            owner: userId,
        }).save();
        newRoom.passcode = passcodeOriginal
        return newRoom
    }

    async update(link: string, userInput: UpdateRoomDto) {
        let updatedRoom: Room;
        if (userInput.passcode) {
            const passcode = this.authService.hashPassword(userInput.passcode);
            updatedRoom = await this.roomEntity.findByIdAndUpdate(
                link,
                {userInput, passcode},
                {new: true},
            );
        }
        updatedRoom = await this.roomEntity.findByIdAndUpdate(link, userInput, {
            new: true,
        });
        updatedRoom.passcode = this.authService.decrypt(updatedRoom.passcode)
        return updatedRoom
    }

    async delete(link: string) {
        const room = await this.roomEntity.findOne({link});
        const deletedRoom = await this.roomEntity.findByIdAndUpdate(room._id, {
            deleted_at: new Date().getTime()
        })
        if (deletedRoom) {
            deletedRoom.passcode = this.authService.decrypt(deletedRoom.passcode)
            return deletedRoom
        }

    }
}
