import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/models/user.schema';
import { AccountConfirmTokenSchema } from './models/accountConfirmToken.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
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
      {
        name: 'confirm-token',
        useFactory: () => {
          const schema = AccountConfirmTokenSchema;
          return schema;
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '2 days' },
      }),
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
