import { Entity } from '@commons/domain';
import { Replace } from '@commons/logic';
import { Account } from './account';

type TenantProps = {
  name: string;
  description?: string;
  accounts: Account[];
  createdAt: Date;
  updatedAt: Date;
};

class Tenant extends Entity<TenantProps> {
  private selfUpdate() {
    this._props.updatedAt = new Date();
  }

  static build(
    props: Replace<
      TenantProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
        accounts?: Account[];
      }
    >,
    id?: string,
  ): Tenant {
    return new Tenant(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        description: props.description || '',
        accounts: props.accounts || [],
      },
      id,
    );
  }
}

export { Tenant, TenantProps };
