import {IsAlpha, IsBoolean, IsLowercase, IsString, Length} from "class-validator";

export class UpdateRoomDto {
    @IsString()
    @Length(6, 6)
    passcode?: string

    @IsBoolean()
    permanent?: boolean

    @IsString()
    @IsAlpha()
    @IsLowercase()
        // edu or normal
    type?: string

    @IsString()
    image?: string
}