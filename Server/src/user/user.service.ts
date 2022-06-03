import {HttpException, HttpStatus, Injectable, NotFoundException, NotImplementedException,} from '@nestjs/common';
import {User} from './entities/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {AuthService} from 'src/auth/auth.service';
import {UserModel} from './user.model';
import {TempUser} from "./entities/tempUser.entity";
import {LeanDocument} from "mongoose"
import {nanoid} from "nanoid";
import {create} from "domain";

@Injectable()
export class UserService {
    constructor(private authService: AuthService, private userModel: UserModel) {
    }

    // <onlineId, User | TempUser>
    private onlineUsers: Record<string, TempUser | LeanDocument<User>> = {};

    async enterSite(userId?: string, onlineId?: string) {
        if (!userId) {
            const onlineId = nanoid()
            const newTempUser: TempUser = {onlineId, displayName: '', likes: []}
            this.addOnline(newTempUser)
            return newTempUser
        }
        const userDB: User = await this.userModel.findById(userId)
        if (userDB) {
            const leanUser: LeanDocument<User> = userDB.toObject({getters: true})
            this.addOnline({...leanUser, onlineId})
            return leanUser
        }
    }

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

    async login(body: { onlineId: string, email: string, password: string }) {
        const user = await this.authService.validateUser(body.email, body.password)
        if (user) {
            const leanUser = user.toObject({getters: true});
            delete leanUser.password
            this.updateOnline(leanUser, body.onlineId)
            const accessToken = this.authService.generateJWT({
                id: user._id.toHexString(),
                email: user.email,
                role: user.role,
                onlineId: body.onlineId
            });
            return {
                ...leanUser,
                onlineId: body.onlineId,
                accessToken,
            }
        }
        throw new NotFoundException('User not found');
    }

    async logout(onlineId: string) {
        this.removeFromOnline(onlineId)
        return await this.enterSite()
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
        return await this.login({
            onlineId: createUserInput.onlineId,
            email: createUserInput.email,
            password: createUserInput.password
        });
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
        this.onlineUsers[user.onlineId] = user
        return user.onlineId
    }

    updateOnline(user: LeanDocument<User> | TempUser, onlineId: string) {
        this.onlineUsers[onlineId] = user
    }

    removeFromOnline(onlineId: string) {
        const user = this.onlineUsers[onlineId]
        delete this.onlineUsers[onlineId]
        return user
    }

    getOnline(onlineId: string) {
        console.log("online user",this.onlineUsers[onlineId])
        return this.onlineUsers[onlineId]
    }

    getOnlines() {
        return this.onlineUsers
    }

    createTemp(displayName: string): TempUser {
        const onlineId = nanoid()
        return <TempUser>{
            displayName,
            onlineId,
            likes: [],
        }
    }
}
