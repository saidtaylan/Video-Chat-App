import {
  IsAlpha,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  @IsAlpha()
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

  @IsInt()
  @IsOptional()
  age: number;

  @IsAlpha()
  @IsOptional()
  role: string;
}
