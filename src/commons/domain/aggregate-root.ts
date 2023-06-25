import { Entity } from './entity';

abstract class AggregateRoot<T = unknown> extends Entity<T> {}

export { AggregateRoot };
