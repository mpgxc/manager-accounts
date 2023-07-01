import { Mapper } from '@commons/interfaces';
import { Maybe } from '@commons/logic';
import { Tenant } from '@domain/entities/tenant';

type TenantPropsInput = {
  name: string;
  description: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
};

class TenantMapper implements Mapper<Tenant, TenantPropsInput> {
  toPersistense = (data: Tenant): TenantPropsInput => ({
    name: data.props.name,
    description: data.props.description,
    createdAt: data.props.createdAt,
    updatedAt: data.props.updatedAt,
  });

  toDomain = (data: TenantPropsInput): Tenant =>
    Tenant.build(
      {
        name: data.name,
        description: data.description!,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        accounts: [],
        /**
         * Accounts are not mapped because they are not needed in the domain layer.
         */
      },
      data.name,
    );
}

export { TenantMapper };
