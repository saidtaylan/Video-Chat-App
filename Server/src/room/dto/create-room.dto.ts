import {IsAlpha, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUppercase, MinLength} from "class-validator";

export class CreateRoomDto {
    onlineId: string

    @IsOptional()
    @IsString()
    @MinLength(6)
    passcode?: string

    @IsNotEmpty()
    @IsAlpha()
    @IsUppercase()
    type: string

    @IsString()
    @IsOptional()
    image?: string
}