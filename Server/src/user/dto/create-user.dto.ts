import {IsAlpha, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString,} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    profileImage: string;

    @IsAlpha()
    @IsOptional()
    role: string;
}
