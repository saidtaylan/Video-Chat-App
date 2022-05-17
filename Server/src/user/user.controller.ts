import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Body,
  Post,
  Put,
  Delete,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTempUserDto } from './dto/create-temp-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (user) return user;
    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  async create(@Body('body', new ValidationPipe()) body: CreateUserDto) {
    const user = await this.userService.createUser(body);
    if (user) return user;
    throw new HttpException(
      'user could not created',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('body', new ValidationPipe()) body: UpdateUserDto,
    @Req()
    req: Partial<{ user: { userId: string; email: string; role: string } }>,
  ) {
    const user = await this.userService.updateUser(id, body);
    if (user) {
      return user;
    }
    throw new HttpException('User not updated', HttpStatus.NOT_MODIFIED);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedUser = await this.userService.deleteUser(id);
    if (deletedUser) return deletedUser;
    throw new HttpException(
      'user could not deleted',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Post('temp')
  async createTemp(@Body() body: CreateTempUserDto) {
    const user = await this.userService.createTempUser(body);
    if (user) return user;
    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete('temp/:id')
  async deleteTemp(@Param('id') id: string) {
    const deletedUser = await this.userService.deleteTempUser(id);
    if (deletedUser) return deletedUser;
    throw new HttpException(
      'Inernal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
