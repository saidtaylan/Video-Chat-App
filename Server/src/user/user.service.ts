import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateTempUserDto } from './dto/create-temp-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(private authService: AuthService, private userModel: UserModel) {}

  async getUser(payload: Object) {
    const user = await this.userModel.findOne(payload);
    if (!user)
      throw new HttpException(
        'could not find such a user',
        HttpStatus.NOT_FOUND,
      );
    delete user.password;
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user)
      throw new HttpException('cannot find such a user', HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }

  async getUsers(payload: Object) {
    const users = await this.userModel.findMany(payload);
    if (users.length > 0) {
      const resp = users.map((user) => {
        delete user.password;
        return user;
      });
      return resp;
    }
    throw new HttpException('cannot find any user', HttpStatus.NOT_FOUND);
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
    this.authService.sendConfirmEmail(createUserInput.email, newUser._id);
    if (!newUser)
      throw new HttpException(
        'user cannot created',
        HttpStatus.NOT_IMPLEMENTED,
      );
    return newUser;
  }

  async updateUser(id: string, updateInput: UpdateUserDto) {
    const updatedUser: User = await this.userModel.update(id, updateInput);
    if (!updatedUser)
      throw new HttpException(
        'the user could not create',
        HttpStatus.NOT_MODIFIED,
      );
    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser: User = await this.userModel.delete(id);
    if (!deletedUser)
      throw new HttpException(
        'the user could not create',
        HttpStatus.NOT_IMPLEMENTED,
      );
    return deletedUser;
  }

  async createTempUser(createTempUserInput: CreateTempUserDto) {
    const user = await this.userModel.insertTemp(
      createTempUserInput.displayName,
    );
    if (user) return user;
    throw new HttpException(
      'an error occured when join the room',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async deleteTempUser(id: string) {
    const deletedUser = await this.userModel.deleteTemp(id);
    if (deletedUser) return deletedUser;
    throw new HttpException(
      'an error occured when leave the room',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getTemp(id: string) {
    const user = await this.userModel.findTemp(id);
    if (user) return user;
    throw new HttpException('could not such a user', HttpStatus.NOT_FOUND);
  }
}
