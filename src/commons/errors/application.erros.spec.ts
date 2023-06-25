import { ApplicationError } from './application-error';

enum ApplicationErrorEnum {
  UnexpectedError = 'UnexpectedError',
  ItemNotFound = 'ItemNotFound',
}

describe('Application - ApplicationError', () => {
  it('should be able to create an instance of contract', () => {
    const exception = ApplicationError.build({
      message: `Unexpected error`,
      name: ApplicationErrorEnum.UnexpectedError,
    });

    expect(exception).toBeInstanceOf(ApplicationError);

    expect(exception).toHaveProperty('time');

    expect(exception).toHaveProperty('name', 'UnexpectedError');

    expect(exception).toHaveProperty('message', 'Unexpected error');
    expect(exception.formatedMessage).toBeTruthy();
  });
});
