import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAccountInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Username must be at least 6 characters long',
  })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone!: string;

  @IsString()
  @IsEmail()
  email!: string;

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
  @IsString()
  @IsEmail()
  email!: string;

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
