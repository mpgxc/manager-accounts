import { Maybe } from './maybe';

type Ok<T> = {
  kind: 'ok';
  isOk: true;
  value: T;
};

type Err<T> = {
  kind: 'err';
  isOk: false;
  error: T;
};

const Ok = <T>(value: Maybe<T | void>): Ok<T> => ({
  kind: 'ok',
  isOk: true,
  value: value as T,
});

const Err = <T>(error: T): Err<T> => ({
  kind: 'err',
  isOk: false,
  error,
});

/**
 *
 * @param notifications  - Array of notifications (Err<T>)
 * @returns Err<T[]> - Array of errors (Err<T>)
 */
const Combine = <T>(notifications: Notifications<T>): Err<T[]> =>
  Err(notifications.map(({ error }) => error));

/**
 * @description Notifications type (Array of errors)
 * @param T - Value type of Err result type (Err<T>)
 * @example const notifications: Notifications<string> = [Err(new Error('Hello World'))];
 */
export type Notifications<T> = Array<Err<T>>;

/**
 * @description Result type
 * @param T - Value type of Ok result type (Ok<T>)
 * @param E - Value type of Err result type (Err<E>)
 * @example const result: Result<string, Error> = Ok('Hello World');
 * @example const result: Result<string, Error> = Err(new Error('Hello World'));
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * @description Async result type
 * @param T - Value type of Ok result type (Ok<T>)
 * @param E - Value type of Err result type (Err<E>)
 * @example const result: AsyncResult<string, Error> = Promise.resolve(Ok('Hello World'));
 * @example const result: AsyncResult<string, Error> = Promise.resolve(Err(new Error('Hello World')));
 */
export type AsyncResult<T, E> = Promise<Result<T, E>>;

export const Result = {
  Ok,
  Err,
  Combine,
};
