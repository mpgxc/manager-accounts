import { Notifications, Result } from './result';

describe('Error Handling - (Result | Result)', () => {
  describe('combine', () => {
    it('should combine notifications into a failure result', () => {
      const notifications: Notifications<string> = [
        Result.Err('Error 1'),
        Result.Err('Error 2'),
      ];

      const combinedResult = Result.Combine(notifications);

      expect(combinedResult).toMatchObject({
        error: ['Error 1', 'Error 2'],
        isOk: false,
      });
    });
  });

  describe('failure', () => {
    it('should create a failure result', () => {
      const failureResult = Result.Err('Error message');

      expect(failureResult).toMatchObject({
        error: 'Error message',
        isOk: false,
      });
    });
  });

  describe('success', () => {
    it('should create a success result without a value', () => {
      const successResult = Result.Ok();

      expect(successResult).toMatchObject({
        value: undefined,
        isOk: true,
      });
    });

    it('should create a success result with a value', () => {
      const successResult = Result.Ok(42);

      expect(successResult).toMatchObject({
        value: 42,
        isOk: true,
      });
    });
  });
});
