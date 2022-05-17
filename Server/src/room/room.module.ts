import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './models/room.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';

@Module({
  providers: [RoomService, RoomGateway],
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
