import {Injectable} from '@nestjs/common';
import type {Server, Socket} from 'socket.io';
import {Room} from 'src/room/entities/room.entity';
import {RoomModel} from 'src/room/room.model';
import {UserModel} from 'src/user/user.model';
import {RoomService} from "../room/room.service";
import {TempUser} from "../user/entities/tempUser.entity";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import type {LeanDocument} from "mongoose"
import {TempRoom} from "../room/entities/tempRoom.entity";
import {WebSocketServer} from "@nestjs/websockets";

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
        server: Server,
        socket: Socket,
        link: string,
        userOnlineId: string,
        displayName?: string,
    ) {
        const room: LeanDocument<Room> | TempRoom = this.roomService.findActive(link);
        const user = await this.userService.getOnline(userOnlineId) as LeanDocument<User> | TempUser
        if (room) {
            if ("displayName" in user) {
                if (room && "members" in room) {
                    return socket.emit("error", <IError>{
                        type: 'JoinError', message: 'You cannot join a permanent room if you are not a registered user'
                    })
                }
                const roomLastStatus = this.roomService.addParticipant(room.link, {
                    ...user,
                    displayName,
                    streamId: '',
                    socketId: socket.id
                })
                socket.join(room.link)
                return server.in(room.link).emit("SomeoneJoined", {
                    user, room: roomLastStatus
                });
            }
            const roomLastStatus = this.roomService.addParticipant(room.link, {
                ...user,
                streamId: '',
                socketId: socket.id
            })
            const roomScores = user.score.points.filter(point => point.room === link)
            socket.join(room.link)
            if (roomScores.length > 0) {
                const totalRoomScore = roomScores.reduce((acc, cur) => {
                    return acc + cur.point
                }, 0)
                return server.in(room.link).emit("SomeoneJoined", {
                    user: {...user, totalRoomScore}, room: roomLastStatus
                });
            }
            return server.in(room.link).emit("SomeoneJoined", {
                user: {...user, totalRoomScore: 0}, room: roomLastStatus
            });
        }
        return socket.emit('error', <IError>{type: 'NotFoundRoom', message: 'cannot found such a room'})
    }

    async leaveRoom(server: Server, socket: Socket, link: string, userOnlineId: string) {
        const user = this.userService.getOnline(userOnlineId)
        const room = this.roomService.findActive(link)
        if (!room) {
            return socket.emit('error', <IError>{type: 'NotFoundRoom', message: 'cannot found such a room'})
        }
        const lastStatusRoom = this.roomService.removeParticipant(link, userOnlineId);
        socket.leave(link)
        if (lastStatusRoom.participants.length === 0) {
            return socket.emit("RoomClosed", {
                type: 'RoomEmptyBcClosed',
                message: 'Room has closed because room is empty because '
            })
        }
        return server.in(link).emit("SomeoneLeft", {room: lastStatusRoom, user});
    }

    async addPoint(server: Server, socket: Socket, body: { user: string, room: string, point: number }) {
        const user = await this.userModel.findById(body.user);
        if (!user) return socket.emit("error", {type: 'NotFoundUser', message: 'not found such a user'})
        user.score.points.push({room: body.room, point: body.point})
        user.score.total += body.point
        user.save()
        const res = {user: body.user, point: body.point}
        server.in(body.room).emit('SomeonePointIncreased', res)

    }

    async subPoint(server: Server, socket: Socket, body: { user: string, room: string, point: number }) {
        const user = await this.userModel.findById(body.user);
        if (!user) return socket.emit("error", {type: 'NotFoundUser', message: 'not found such a user'})
        user.score.points.push({room: body.room, point: body.point})
        user.score.total -= body.point
        user.save()
        const res = {user: body.user, point: body.point}
        server.in(body.room).emit('SomeonePointDecreased', res)
    }

    async closeRoom(server: Server, socket: Socket, link: string) {
        const room = await this.roomModel.findOne({link})
        if (room) {
            await this.roomModel.delete(link)
            const allSockets = await socket.to(link).allSockets()
            server.in(link).emit("RoomClosed")
            server.in(link).socketsLeave(Array.from(allSockets))
        }
    }

    disconnect(onlineId: string) {
        this.userService.removeFromOnline(onlineId)
    }

    changeOwner(body: { room: string, newOwnerOnlineId: string }) {
        this.roomService.changeOwner(body)
    }

    dispatchStreamId(server: Server, body: { onlineId: string, link: string, streamId: string }) {
        const room = this.roomService.findActive(body.link)
        if (room) {
            const roomLastStatus = this.roomService.addStreamId(body)
            server.in(body.link).emit("AddedStreamId", roomLastStatus)
        }
    }

    switchUserMic(socket: Socket, body: { userSocketId: string, switch: boolean }) {
        socket.to(body.userSocketId).emit("YourMicSwitched", {status: body.switch})
    }

    switchUserCam(socket: Socket, body: { userSocketId: string, switch: boolean }) {
        socket.to(body.userSocketId).emit("YourCameraSwitched", {status: body.switch})
    }
}
