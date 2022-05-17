import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { TempUser } from './models/tempUser.model';
import { CreateTempUserDto } from './dto/create-temp-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly UserModel: Model<User>,
    @InjectModel('temp-user') private TempUserModel: Model<TempUser>,
    private authService: AuthService,
  ) {}

  async getUsers() {
    const users = await this.UserModel.find().lean();
    const resp = users.map((user) => {
      return {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profile_image: user.profileImage,
        age: user.age,
      };
    });
    return resp;
  }

  async getUserById(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) return undefined;
    delete user.password;
    return user;
  }

  async getUser(payload: Object) {
    const users = await this.UserModel.find(payload).lean();
    if (users) {
      const resp = users.map((user) => {
        return {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profile_image: user.profileImage,
          age: user.age,
        };
      });
      return resp;
    }
    return undefined;
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
    const { password } = createUserInput;
    createUserInput.password = await this.authService.hashPassword(password);
    const newUser: User = await new this.UserModel(createUserInput).save();
    this.authService.sendConfirmEmail(createUserInput.email, newUser._id);
    if (!newUser) return undefined;
    delete newUser.password;
  }

  async updateUser(id: string, updateInput: UpdateUserDto) {
    if (updateInput?.password) {
      const { password } = updateInput;
      updateInput.password = await this.authService.hashPassword(password);
    }
    const updatedUser: User = await this.UserModel.findByIdAndUpdate(
      id,
      updateInput,
      { new: true },
    ).lean();
    if (!updatedUser) return undefined;
    delete updatedUser.password;
    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser: User = await this.UserModel.findByIdAndDelete(id);
    if (!deletedUser) return undefined;
    return deletedUser;
  }

  async createTempUser(createTempUserInput: CreateTempUserDto) {
    const user = await new this.TempUserModel(createTempUserInput).save();
    if (user) return user;
    return undefined;
  }

  async deleteTempUser(id: string) {
    const deletedUser = await this.TempUserModel.findByIdAndDelete(id);
    if (deletedUser) return deletedUser;
    return undefined;
  }

  async getTemp(id: string) {
    const user = await this.TempUserModel.findById(id)
    if(user) return user
    return undefined
  }
}
