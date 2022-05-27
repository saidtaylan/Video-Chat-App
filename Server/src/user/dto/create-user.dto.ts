import {IsAlpha, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString,} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    onlineId: string

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    profileImage: string;

    @IsOptional()
    @IsAlpha()
    role: string;
}
