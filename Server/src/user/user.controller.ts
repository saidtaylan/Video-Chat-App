import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req, UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserService} from './user.service';
import {LoginDto} from "./dto/login.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {OptionalJWTGuard} from "../auth/guards/optional-jwt.guard";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return await this.userService.getUsers({});
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id') id: string) {
        const user = await this.userService.getUserById(id);
        if (user) return user;
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    // get users by query parameters as age or role or name(fullName)
    @UseGuards(JwtAuthGuard)
    @Get('get')
    async get(@Query() query: { age?: number, role?: string, name?: string }) {
        return await this.userService.getUsers(query)
    }

    @Post('login')
    async login(
        @Body() body: LoginDto) {
        return await this.userService.login(body);
    }

    @Post("register")
    async create(@Body(new ValidationPipe()) body: CreateUserDto) {
        const user = await this.userService.createUser(body);
        if (user) return user;
        throw new HttpException(
            'user could not created',
            HttpStatus.NOT_IMPLEMENTED,
        );
    }

    //@UseGuards(JwtAuthGuard)
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

    // @UseGuards(JwtAuthGuard)
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
}
