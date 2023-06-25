import { AggregateRoot, Entity } from 'commons/domain';

export interface Mapper<Input extends Entity | AggregateRoot, Response> {
  toPersistense(data: Input): Response;

  toDomain(data: Response): Input;

  toView?(data: Input): Response;
}
