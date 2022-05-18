import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { TempUserSchema } from './entities/tempUser.schema';
import {UserModel} from "src/user/user.model"

@Module({
  providers: [UserService, UserModel],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'user',
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            next();
          });
          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'temp-user',
        useFactory: () => {
          const schema = TempUserSchema;
          schema.pre('save', function (next) {
            next();
          });
          return schema;
        },
      },
    ]),

    AuthModule
  ],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
