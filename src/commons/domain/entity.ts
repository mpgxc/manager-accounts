import { EntityId } from './entity-id';

abstract class Entity<T = unknown> {
  private readonly _id: string;
  protected readonly _props: T;

  protected constructor(props: T, id?: string) {
    this._props = props;
    this._id = id || EntityId.build();
  }

  get id(): string {
    return this._id;
  }

  get props(): T {
    return this._props;
  }
}

export { Entity };
