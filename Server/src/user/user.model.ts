import { User } from 'src/user/entities/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { TempUser } from './entities/tempUser.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserModel {
  constructor(
    @InjectModel('user') private readonly userEntity: Model<User>,
    @InjectModel('temp-user') private tempUserEntity: Model<TempUser>,
    private readonly authService: AuthService,
  ) {}

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
    const password = await this.authService.hashPassword(userInput.password);
    const newUser = await new this.userEntity({ ...userInput, password }).save();
    delete newUser.password;
    return newUser;
  }

  async update(id: string, userInput: UpdateUserDto) {
    if (userInput.password) {
      const password = await this.authService.hashPassword(userInput.password);
      const updatedUser = await this.userEntity.findByIdAndUpdate(
        id,
        { ...userInput, password },
        { new: true },
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
      { deleted_at: new Date().getTime() },
      { new: true },
    );
    if (deletedUser) {
      delete deletedUser.password;
      return deletedUser;
    }
  }

  async findTemp(id: string) {
    return await this.tempUserEntity.findById(id);
  }

  async insertTemp(displayName: string) {
    return await new this.tempUserEntity({ displayName }).save();
  }

  async updateTemp(id: string, newDisplayName: string) {
    return await this.tempUserEntity.findByIdAndUpdate(
      id,
      { newDisplayName },
      { new: true },
    );
  }

  async deleteTemp(id: string) {
    return await this.userEntity.findByIdAndDelete(id);
  }
}
