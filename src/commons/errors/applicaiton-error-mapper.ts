import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ApplicationErrorType } from '.';

type HttpExceptionType =
  | typeof NotFoundException
  | typeof ConflictException
  | typeof ForbiddenException
  | typeof BadRequestException;

class ApplicationErrorMapper {
  toException: Record<ApplicationErrorType, HttpExceptionType> = {
    AccountNotFound: NotFoundException,
    UnexpectedError: BadRequestException,
    AccountAlreadyExists: ConflictException,
    AccountUnauthorizedAccess: ForbiddenException,
    EmailAlreadyRegistered: ConflictException,
    AccountCantRegister: UnauthorizedException,
    CantAuthenticateAccount: UnauthorizedException,
    TenantNotFound: NotFoundException,
    TenantAlreadyExists: ConflictException,
  };
}

export { ApplicationErrorMapper };
