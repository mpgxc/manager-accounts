import { ApplicationError, ApplicationErrorType } from '@commons/errors';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const exceptionMapper = <T extends ApplicationErrorType[]>(
  token: ApplicationErrorType,
) => {
  if (['UnexpectedError'].includes(token)) {
    return InternalServerErrorException;
  }

  if ((['AccountNotFound', 'TenantNotFound'] as T).includes(token)) {
    return NotFoundException;
  }

  if (
    (
      [
        'AccountAlreadyExists',
        'EmailAlreadyRegistered',
        'TenantAlreadyExists',
        'ConflictManySessionsRequest',
      ] as T
    ).includes(token)
  ) {
    return ConflictException;
  }

  if (
    (
      [
        'AccountCantRegister',
        'AccountUnauthorizedAccess',
        'CantRefreshToken',
        'CantAuthenticateAccount',
      ] as T
    ).includes(token)
  ) {
    return UnauthorizedException;
  }

  return InternalServerErrorException;
};

export const ExceptionMapper = ({ name, message }: ApplicationError) =>
  new (exceptionMapper(name))(message);
