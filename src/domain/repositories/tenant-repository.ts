import { Repository } from '@commons/interfaces';
import { TenantProps } from '@commons/types';
import { Tenant } from '@domain/entities/tenant';

type TenantRepositoryOutput = TenantProps;

interface TenantRepository
  extends Omit<
    Repository<Tenant, TenantRepositoryOutput>,
    'delete' | 'update' | 'list'
  > {}

export { TenantRepository, TenantRepositoryOutput };
