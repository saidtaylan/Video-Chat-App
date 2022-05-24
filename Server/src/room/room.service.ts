import {Injectable, NotFoundException, NotImplementedException,} from '@nestjs/common';
import {UserService} from 'src/user/user.service';
import {Room} from './entities/room.entity';
import {AuthService} from 'src/auth/auth.service';
import {UpdateRoomDto} from './dto/update-room.dto';
import {RoomModel} from 'src/room/room.model';
import {User} from "../user/entities/user.entity";
import {TempUser} from "../user/entities/tempUser.entity";
import {TempRoom} from "./entities/tempRoom.entity";
import {LeanDocument} from "mongoose"
import {nanoid} from "nanoid";
import {UserModel} from "../user/user.model";

@Injectable()
export class RoomService {
    constructor(
        private readonly userService: UserService,
        private readonly roomModel: RoomModel,
        private authService: AuthService,
        private readonly userModel: UserModel
    ) {
    }

    // Actives: roomLink, Room | TempRoom
    activeRooms: { permanent: Record<string, LeanDocument<Room> | TempRoom>, temporary: Record<string, LeanDocument<Room> | TempRoom> } = {
        permanent: {},
        temporary: {}
    }

    create(userOnlineId?: string, displayName?: string) {
        if (userOnlineId) {
            const user = this.userService.getOnline(userOnlineId)
            if (user) {
                const link = nanoid(25);
                const passcodeOriginal = nanoid(8);
                const passcode = this.authService.encrypt({passcodeOriginal});

                const newTempRoom: TempRoom = {
                    link,
                    owner: user,
                    passcode,
                    participants: [],
                    type: 'normal'
                }
                this.addActive(newTempRoom, false)
                this.addParticipant(link, user)
                return newTempRoom
            }
        }
        const newTempUser: TempUser = this.userService.createTemp(displayName)
        const link = nanoid(25);
        const passcodeOriginal = nanoid(8);
        const passcode = this.authService.encrypt({passcodeOriginal});
        const newTempRoom: TempRoom = {
            link,
            owner: newTempUser,
            passcode,
            participants: [],
            type: 'normal'
        }
        this.addActive(newTempRoom, false)
        this.addParticipant(link, newTempUser)
        return newTempRoom
    }


    async get(userId: string, type?: string) {
        if (type) {
            const rooms = await this.roomModel.findMany({owner: userId, type})
            if (rooms.length > 0) {
                return rooms
            }
            throw new NotFoundException('could not found any room');
        }
        const rooms = await this.roomModel.findMany({owner: userId});
        if (rooms.length > 0) {
            return rooms.map(room => {
                return room.toObject({getters: true})
            })
        }
        throw new NotFoundException('could not found any room ');
    }

    async getById(id: string) {
        const room = await this.roomModel.findById(id);
        if (room) return room.toObject({getters: true})
        throw new NotFoundException('cannot found such a room');
    }

    async getByLink(link: string) {
        const room = await this.roomModel.findOne({link});
        if (room) return room.toObject({getters: true})
        throw new NotFoundException('cannot found such a room');
    }

    async getOne(payload: {}) {
        const room = await this.roomModel.findOne(payload);
        if (room) return room.toObject({getters: true})
        throw new NotFoundException('cannot found such a room');
    }

    async updateRoom(id: string, updatePayload: UpdateRoomDto) {
        const updatedRoom = await this.roomModel.update(id, updatePayload);
        if (updatedRoom) {
            return updatedRoom.toObject({getters: true});
        }
        throw new NotImplementedException('the room could not updated');
    }

    async deleteRoom(link: string) {
        const deletedRoom = await this.roomModel.delete(link);
        if (deletedRoom) {
            return deletedRoom.toObject({getters: true});
        }
        throw new NotImplementedException('the room could not deleted');
    }

    async isActive(link: string) {
        let isActive: boolean;
        if (link in this.activeRooms.temporary) return isActive = !!this.activeRooms.temporary[link]
        else if (link in this.activeRooms.permanent) return isActive = !!this.activeRooms.permanent[link]
    }

    getActives(temporary?: boolean) {
        if (temporary === undefined) return this.activeRooms
        else if (temporary === true) return this.activeRooms.temporary
        else if (temporary === false) return this.activeRooms.permanent
    }

    findActive(link: string) {
        if (this.isOnlineRoomPermanent(link)) return this.activeRooms.temporary[link]
        return this.activeRooms.permanent[link]
    }

    addActive(room: LeanDocument<Room> | TempRoom, permanent: boolean) {
        if (permanent) return this.activeRooms.permanent[room.link] = room
        else this.activeRooms.temporary[room.link] = room
    }

    deleteActive(link: string) {
        if (this.isOnlineRoomPermanent(link)) return delete this.activeRooms.temporary[link]
        return delete this.activeRooms.permanent[link]
    }

    updateActive(link: string, room: LeanDocument<Room> | TempRoom, permanent: boolean) {
        if (this.isOnlineRoomPermanent(link)) return this.activeRooms.permanent[link] = room
        return this.activeRooms.temporary[link] = room
    }

    addParticipant(link: string, user: LeanDocument<User> | TempUser) {
        if (this.isOnlineRoomPermanent(link)) return this.activeRooms.permanent[link].participants.push(user)
        return this.activeRooms.temporary[link].participants.push(user)
    }

    isOnlineRoomPermanent(link) {
        let permanent;
        if (link in this.activeRooms.permanent) return permanent = !!this.activeRooms.permanent[link]
        else if (link in this.activeRooms.temporary) return permanent = !!!this.activeRooms.temporary[link]
    }

    removeParticipant(link: string, userOnlineId: string) {
        if (this.isOnlineRoomPermanent(link)) {
            const user = this.activeRooms.permanent[link]
            user.participants = user.participants.filter(p => p.onlineId !== userOnlineId)
            return user
        }
        const user = this.activeRooms.temporary[link]
        user.participants = user.participants.filter(p => p.onlineId !== userOnlineId)
        return user
    }

    likeUser(body: { room: string, userOnlineId: string, fromOnlineId: string }) {
        const user = this.get
        if (this.isOnlineRoomPermanent(body.room)) {
            return this.activeRooms.permanent[body.room].participants.forEach(p => {
                if (p.onlineId === body.userOnlineId) {
                    p.likes.push(body)
                }
            })
        }
        return this.activeRooms.temporary[body.room].participants[body.userOnlineId]
    }

    getLikesOfRoom(room: string) {
        if (this.isOnlineRoomPermanent(room)) return this.activeRooms.permanent[room].participants
        return this.activeRooms.temporary[room].participants
    }

    likeBack(body: { room: string, userOnlineId: string, fromOnlineId: string }) {

        const isPermanent = this.isOnlineRoomPermanent(body.room)

        if (isPermanent) {
            const room = this.activeRooms.permanent[body.room]
            room.participants.forEach((p, index) => {
                if (p.onlineId === body.userOnlineId) {
                    p.likes.forEach((l, idx) => {
                        if (l.fromOnlineId === body.fromOnlineId) p.likes.splice(idx, 1)
                    })
                }
            })
        }
        return this.activeRooms.temporary[body.room].participants[body.userOnlineId].likes.filter(l => l !== body.fromOnlineId)
    }
}