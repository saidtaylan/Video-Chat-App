import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator"

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(8, 14, {message: 'the password length must be 8-14'})
    password: string
}