export * from './applicaiton-error-mapper';
export * from './application-error';

export enum ApplicationErrorEnum {
  AccountNotFound,
  UnexpectedError,
  AccountCantRegister,
  AccountAlreadyExists,
  AccountUnauthorizedAccess,
  EmailAlreadyRegistered,
  CantAuthenticateAccount,
  TenantNotFound,
}

export type ApplicationErrorType = keyof typeof ApplicationErrorEnum;
