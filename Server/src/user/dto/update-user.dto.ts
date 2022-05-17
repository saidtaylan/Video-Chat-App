import { IsAlpha, IsEmail, IsString, Length } from 'class-validator';
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

  age?: number;

  status?: string

  @IsAlpha()
  role?: string;
}
