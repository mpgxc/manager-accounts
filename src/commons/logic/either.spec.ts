import { Notifications, Result } from './either';

describe('Error Handling - (Result | Either)', () => {
  describe('combine', () => {
    it('should combine notifications into a failure result', () => {
      const notifications: Notifications<string> = [
        Result.failure('Error 1'),
        Result.failure('Error 2'),
      ];

      const combinedResult = Result.combine(notifications);

      expect(combinedResult).toMatchObject({
        value: ['Error 1', 'Error 2'],
        hasError: true,
      });
    });
  });

  describe('failure', () => {
    it('should create a failure result', () => {
      const failureResult = Result.failure('Error message');

      expect(failureResult).toMatchObject({
        value: 'Error message',
        hasError: true,
      });
    });
  });

  describe('success', () => {
    it('should create a success result without a value', () => {
      const successResult = Result.success();

      expect(successResult).toMatchObject({
        value: undefined,
        hasError: false,
      });
    });

    it('should create a success result with a value', () => {
      const successResult = Result.success(42);

      expect(successResult).toMatchObject({
        value: 42,
        hasError: false,
      });
    });
  });
});
