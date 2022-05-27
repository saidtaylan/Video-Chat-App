import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Room} from 'src/room/entities/room.entity';
import {RoomModel} from 'src/room/room.model';
import {UserModel} from 'src/user/user.model';
import {RoomService} from "../room/room.service";
import {TempUser} from "../user/entities/tempUser.entity";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import type {LeanDocument} from "mongoose"
import {TempRoom} from "../room/entities/tempRoom.entity";

@Injectable()
export class WsService {
    constructor(private readonly roomModel: RoomModel, private readonly userModel: UserModel, private roomService: RoomService, private userService: UserService) {
    }

    like(body: { room: string, userOnlineId: string, fromOnlineId: string }) {
        this.roomService.likeUser(body)

    }

    likeBack(body: { room: string, userOnlineId: string, fromOnlineId: string }) {
        this.roomService.likeBack(body)
    }

    getLikesOfRoom(room: string) {
        return this.roomService.getLikesOfRoom(room)
    }

    async joinRoom(
        socket: Socket,
        link: string,
        userOnlineId: string,
        displayName?: string,
    ) {
        const room: LeanDocument<Room> | TempRoom = this.roomService.findActive(link);
        const user = await this.userService.getOnline(userOnlineId) as LeanDocument<User>
        if (room) {
            if ("displayName" in user) {
                if (room && "members" in room) {
                    return socket.emit("error", <IError>{
                        type: 'JoinError', message: 'You cannot join a permanent room if you are not a registered user'
                    })
                }
                this.roomService.addParticipant(room.link, user)
                socket.join(room.link)
                return socket.in(room.link).emit("SomeoneJoined", {
                    user, room
                });
            }
            const roomScores = user.score.points.filter(point => point.room === link)
            const totalRoomScore = roomScores.reduce((acc, cur) => {
                return acc + cur.point
            }, 0)
            return socket.to(room.link).emit("SomeoneJoined", {
                user: {...user, totalRoomScore}, room
            });
        }
        return socket.emit('error', <IError>{type: 'NotFoundRoom', message: 'cannot found such a room'})
    }

    async leaveRoom(socket: Socket, link: string, userOnlineId: string) {
        const room = this.roomService.findActive(link)
        if (!room) {
            return socket.emit('error', <IError>{type: 'NotFoundRoom', message: 'cannot found such a room'})
        }
        this.roomService.removeParticipant(link, userOnlineId);
        const offlineUser = this.userService.removeFromOnline(userOnlineId)
        if (offlineUser) {
            socket.leave(link)
            if (Object.keys(room.participants).length === 0) {
                return socket.emit("RoomClosed", {
                    type: 'RoomEmptySoClosed',
                    message: 'Room is empty because room has closed'
                })
            }
            return socket.to(link).emit("SomeoneLeft", <TempUser>offlineUser);
        }
        return socket.emit('error', <IError>{type: 'LeaveError', message: 'could not leave the room'})
    }

    async addPoint(socket: Socket, body: { user: string, room: string, point: number }) {
        const user = await this.userModel.findById(body.user);
        if (!user) return socket.emit("error", {type: 'NotFoundUser', message: 'not found such a user'})
        user.score.points.push({room: body.room, point: body.point})
        user.score.total += body.point
        user.save()
        const res = {user: body.user, point: body.point}
        socket.to(body.room).emit('SomeonePointIncreased', res)

    }

    async subPoint(socket: Socket, body: { user: string, room: string, point: number }) {
        const user = await this.userModel.findById(body.user);
        if (!user) return socket.emit("error", {type: 'NotFoundUser', message: 'not found such a user'})
        user.score.points.push({room: body.room, point: body.point})
        user.score.total -= body.point
        user.save()
        const res = {user: body.user, point: body.point}
        socket.to(body.room).emit('SomeonePointDecreased', res)
    }

    async closeRoom(socket: Socket, link: string) {
        const room = await this.roomModel.findOne({link})
        if (room) {
            await this.roomModel.delete(link)
            const allSockets = await socket.to(link).allSockets()
            socket.to(link).emit("RoomClosed")
            socket.to(link).socketsLeave(Array.from(allSockets))
        }

    }

    disconnect(onlineId: string) {
        this.userService.removeFromOnline(onlineId)
    }
}
