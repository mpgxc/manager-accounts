import { validate } from 'class-validator';

export abstract class InputDtosValidate {
  protected validate = async <T extends object>(instance: T) => {
    const validations = await validate(instance);

    const exceptions = validations.reduce((acc, { property, constraints }) => {
      return (acc[property] = Object.values(constraints || {}));
    }, {}) as Record<string, string[]>;

    const hasError = Object.keys(exceptions).length;

    return {
      hasError,
      exceptions,
    };
  };
}
