import {Module} from '@nestjs/common';
import {WsService} from './ws.service';
import {WsGateway} from './ws.gateway';
import {RoomModule} from 'src/room/room.module';
import {UserModule} from 'src/user/user.module';

@Module({
    providers: [WsGateway, WsService],
    imports: [RoomModule, UserModule]
})
export class WsModule {
}
