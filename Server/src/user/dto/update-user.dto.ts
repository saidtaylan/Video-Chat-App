import {IsAlpha, IsString, Length} from 'class-validator';

export class UpdateUserDto {
    @IsAlpha()
    name?: string;

    @IsAlpha()
    lastName?: string;

    @Length(8, 20)
    @IsString()
    password?: string;

    @IsString()
    profileImage?: string;

    status?: string

    @IsAlpha()
    role?: string;

    point?: {
        user: string,
        room: string,
        point: number
        date: Date
    }
}
