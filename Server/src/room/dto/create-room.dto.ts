import { IsAlpha, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUppercase, MinLength } from "class-validator";

export class CreateRoomDto {
    
    @IsOptional()
    @IsString()
    @MinLength(6)
    passcode?: string

    @IsOptional()
    @IsBoolean()
    permanent?: boolean

    @IsNotEmpty()
    @IsAlpha()
    @IsUppercase()
    type: string

    @IsString()
    @IsOptional()
    image?: string
}