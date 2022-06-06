import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {WsService} from './ws.service';
import {Server, Socket} from "socket.io"


@WebSocketGateway({
    extraHeaders: {},
    cors: {
        origin: '*',
    }
})
export class WsGateway {

    constructor(private readonly wsService: WsService) {
    }

    @WebSocketServer()
    server: Server

    @SubscribeMessage('like')
    like(@MessageBody() body: { room: string, userOnlineId: string, fromOnlineId: string }, @ConnectedSocket() socket: Socket) {
        this.wsService.like(body);
        socket.emit("liked", body)
        socket.to(body.room).emit('liked', body)
    }

    @SubscribeMessage('likeBack')
    likeBack(@MessageBody() body: { room: string, userOnlineId: string, fromOnlineId: string }, @ConnectedSocket() socket: Socket) {
        this.wsService.likeBack(body)
        socket.to(body.room).emit('likedBack', body)
    }

    @SubscribeMessage('getRoomLikes')
    getRoomLikes(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
        const likesOfRoom = this.wsService.getLikesOfRoom(room)
        socket.to(room).emit('roomLikes', likesOfRoom)
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(@MessageBody() body: { room: string, userOnlineId?: string, displayName?: string }, @ConnectedSocket() socket: Socket) {
        if (!body.displayName) {
            await this.wsService.joinRoom(this.server, socket, body.room, body.userOnlineId)
        } else if (body.displayName) {
            await this.wsService.joinRoom(this.server, socket, body.room, body.userOnlineId, body.displayName)
        }
    }

    @SubscribeMessage('leaveRoom')
    async leaveRoom(@MessageBody() body: { room: string, userOnlineId: string }, @ConnectedSocket() socket: Socket) {
        await this.wsService.leaveRoom(this.server, socket, body.room, body.userOnlineId)
    }

    @SubscribeMessage('addPoint')
    async addPoint(@MessageBody() body: { user: string, room: string, point: number }, @ConnectedSocket() socket: Socket) {
        await this.wsService.addPoint(this.server, socket, body)
    }

    @SubscribeMessage('subPoint')
    async subPoint(@MessageBody() body: { user: string, room: string, point: number }, @ConnectedSocket() socket: Socket) {
        await this.wsService.subPoint(this.server, socket, body)
    }

    @SubscribeMessage('closeRoom')
    async closeRoom(@MessageBody() body: { room: string }, @ConnectedSocket() socket: Socket) {
        await this.wsService.closeRoom(this.server, socket, body.room)
    }

    @SubscribeMessage('disconnect')
    async disconnect(@MessageBody() body: { onlineId: string }, @ConnectedSocket() socket: Socket) {
        this.wsService.disconnect(body.onlineId)
    }

    @SubscribeMessage('changeOwner')
    changeOwner(@MessageBody() body: {room: string, newOwnerOnlineId: string}, @ConnectedSocket() socket: Socket) {
        this.wsService.changeOwner(this.server, body)
    }

    @SubscribeMessage('dispatchStreamId')
    dispatchStreamId(@MessageBody() body: {onlineId: string, link: string, streamId: string}, @ConnectedSocket() socket: Socket) {
        this.wsService.dispatchStreamId(this.server, body);
    }

    @SubscribeMessage("switchUserMic")
    switchUserMic(@MessageBody() body: {userSocketId: string, switch: boolean}, @ConnectedSocket() socket: Socket){
        this.wsService.switchUserMic(socket, body)
    }

    @SubscribeMessage("switchUserCam")
    switchUserCam(@MessageBody() body: {userSocketId: string, switch: boolean}, @ConnectedSocket() socket: Socket) {
        this.wsService.switchUserCam(socket, body)
    }
}
