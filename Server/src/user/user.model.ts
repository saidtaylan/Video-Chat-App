import {User} from 'src/user/entities/user.entity';
import {InjectModel} from '@nestjs/mongoose';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {CreateUserDto} from 'src/user/dto/create-user.dto';
import {UpdateUserDto} from 'src/user/dto/update-user.dto';
import {AuthService} from 'src/auth/auth.service';

@Injectable()
export class UserModel {
    constructor(
        @InjectModel('user') private readonly userEntity: Model<User>,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService
    ) {
    }

    async findById(id: string) {
        return await this.userEntity.findById(id);
    }

    async findOne(payload: {}) {
        return await this.userEntity.findOne(payload);
    }

    async findMany(payload: {}) {
        return await this.userEntity.find(payload);
    }

    async insert(userInput: CreateUserDto) {
        const newUser = await new this.userEntity(userInput).save();
        delete newUser.password;
        return newUser;
    }

    async update(id: string, userInput: UpdateUserDto) {
        if (userInput.password) {
            const updatedUser = await this.userEntity.findByIdAndUpdate(
                id,
                userInput,
                {new: true},
            );
            if (updatedUser) {
                delete updatedUser.password;
                return updatedUser;
            }
            return undefined;
        }
        const updatedUser = await this.userEntity.findByIdAndUpdate(id, userInput, {
            new: true,
        });
        if (updatedUser) {
            delete updatedUser.password;
            return updatedUser;
        }
        return undefined;
    }

    async delete(id: string) {
        const deletedUser = await this.userEntity.findByIdAndUpdate(
            id,
            {deleted_at: new Date().getTime()},
            {new: true},
        );
        if (deletedUser) {
            delete deletedUser.password;
            return deletedUser;
        }
    }

}
