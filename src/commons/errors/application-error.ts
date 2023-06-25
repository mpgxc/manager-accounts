import { ApplicationErrorType } from '.';

type ApplicationErrorProps = {
  name: ApplicationErrorType;
  message: string;
};

export class ApplicationError extends Error {
  public time: Date;
  public name: ApplicationErrorType;

  private constructor({ message, name }: ApplicationErrorProps) {
    super(message);

    this.name = name;
    this.time = new Date();
  }

  get formatedMessage() {
    return `[${this.time.toLocaleDateString()}] - ${this.name} - ${
      this.message
    }`;
  }

  static build({ message, name }: ApplicationErrorProps) {
    return new this({
      message,
      name,
    });
  }
}
