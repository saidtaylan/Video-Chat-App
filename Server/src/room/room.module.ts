import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './entities/room.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomController } from './room.controller';
import {RoomModel} from "src/room/room.model"

@Module({
  providers: [RoomService, RoomModel],
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeatureAsync([
      {
        name: 'room',
        useFactory: () => {
          const schema = RoomSchema;
          schema.pre('save', function (next) {
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [RoomController],
})
export class RoomModule {}
