import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true}),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    RoomModule,
  ],
})
export class AppModule {}
