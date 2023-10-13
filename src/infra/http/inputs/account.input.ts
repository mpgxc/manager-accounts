import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAccountInput {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Username must be at least 6 characters long',
  })
  username!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  phone!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 32,
    description:
      'Password must contain at least one uppercase letter, one lowercase letter and one number or special character',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(32, {
    message: 'Password must be at most 32 characters long',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number or special character',
  })
  password!: string;
}

export class AuthenticateAccountInput {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 32,
    description:
      'Password must contain at least one uppercase letter, one lowercase letter and one number or special character',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(32, {
    message: 'Password must be at most 32 characters long',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number or special character',
  })
  password!: string;
}
