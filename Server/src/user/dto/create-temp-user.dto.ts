import { IsString } from "class-validator";

export class CreateTempUserDto {
    @IsString()
    displayName: string
}