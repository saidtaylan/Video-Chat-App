import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { TempUserSchema } from './models/tempUser.schema';

@Module({
  providers: [UserService],
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
