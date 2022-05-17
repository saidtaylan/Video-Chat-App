import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import {Server} from "socket.io"

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}
  @SubscribeMessage('user-point')
  handleMessage(@MessageBody() body: { point: Number; room: string }) {
      this.server.emit("")
  }
}
