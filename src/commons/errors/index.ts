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
}

export type ApplicationErrorType = keyof typeof ApplicationErrorEnum;
