import {HttpException, HttpStatus, Injectable, NotFoundException, NotImplementedException,} from '@nestjs/common';
import {User} from './entities/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {AuthService} from 'src/auth/auth.service';
import {UserModel} from './user.model';
import {TempUser} from "./entities/tempUser.entity";
import {LeanDocument} from "mongoose"
import {nanoid} from "nanoid";

@Injectable()
export class UserService {
    constructor(private authService: AuthService, private userModel: UserModel) {
    }

    // <onlineId, User | TempUser>
    private onlineUsers: Record<string, TempUser | LeanDocument<User>> = {};

    async getUser(payload: Object) {
        const user = await this.userModel.findOne(payload);
        if (!user)
            throw new HttpException(
                'could not find such a user',
                HttpStatus.NOT_FOUND,
            );
        delete user.password;
        return user.toObject({getters: true});
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new HttpException('cannot find such a user', HttpStatus.NOT_FOUND);
        delete user.password;
        return user.toObject({getters: true});
    }

    async getUsers(payload: Object) {
        const users = await this.userModel.findMany(payload);
        if (users.length > 0) {
            return users.map((user) => {
                delete user.password;
                return user.toObject({getters: true});
            });
        }
        throw new HttpException('cannot find any user', HttpStatus.NOT_FOUND);
    }

    async login(email: string, password: string) {
        const user = await this.authService.validateUser(email, password)
        if (user) {
            const leanUser = user.toObject({getters: true});
            delete leanUser.password
            const onlineId = this.addOnline(leanUser)
            const accessToken = this.authService.generateJWT({
                id: user._id.toHexString(),
                email: user.email,
                role: user.role,
                onlineId
            });
            return {
                ...leanUser,
                accessToken,
                onlineId
            }
        }
        throw new NotFoundException('User not found');
    }

    async logout(onlineId: string) {
        return this.removeFromOnline(onlineId)
    }

    async createUser(createUserInput: CreateUserDto) {

        const isUserExist = await this.authService.isAlreadyExist(
            createUserInput.email,
        );
        if (isUserExist)
            throw new HttpException(
                'such a user already exist',
                HttpStatus.NOT_IMPLEMENTED,
            );

        const newUser: User = await this.userModel.insert(createUserInput);
        await this.authService.sendConfirmEmail(createUserInput.email, newUser._id);
        if (!newUser)
            throw new HttpException(
                'user could not create',
                HttpStatus.NOT_IMPLEMENTED,
            );
        return await this.login(createUserInput.email, createUserInput.password)
    }

    async updateUser(id: string, updateInput: UpdateUserDto) {
        const updatedUser: User = await this.userModel.update(id, updateInput);
        if (!updatedUser)
            throw new HttpException(
                'the user could not update',
                HttpStatus.NOT_MODIFIED,
            );
        return updatedUser.toObject({getters: true});

    }

    async deleteUser(id: string) {
        const deletedUser: User = await this.userModel.delete(id);
        if (!deletedUser)
            throw new HttpException(
                'the user could not delete',
                HttpStatus.NOT_IMPLEMENTED,
            );
        return deletedUser.toObject({getters: true});
    }

    addOnline(user: LeanDocument<User> | TempUser) {
        const onlineId = nanoid()
        this.onlineUsers[onlineId] = user
        return onlineId
    }

    removeFromOnline(onlineId: string)  {
        const user = this.onlineUsers[onlineId]
        delete this.onlineUsers[onlineId]
        return user
    }

    getOnline(onlineId: string) {
        return this.onlineUsers[onlineId]
    }

    getOnlines() {
        return this.onlineUsers
    }

    createTemp(displayName: string): TempUser {
        const onlineId = nanoid()
        return <TempUser>{
            onlineId,
            displayName
        }
    }
}
