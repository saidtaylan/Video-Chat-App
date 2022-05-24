import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './entities/user.schema';
import {AuthModule} from 'src/auth/auth.module';
import {UserController} from './user.controller';
import {UserModel} from "src/user/user.model"

@Module({
    providers: [UserService, UserModel],
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'user',
                useFactory: () => {
                    return UserSchema;
                },
            },
        ]),

        AuthModule
    ],
    exports: [UserService, UserModel],
    controllers: [UserController]
})
export class UserModule {
}
