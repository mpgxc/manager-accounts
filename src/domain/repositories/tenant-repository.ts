import { Repository } from '@commons/interfaces';
import { Tenant, TenantProps } from '@domain/entities/tenant';

type TenantRepositoryOutput = TenantProps & {
  id: string;
};

interface TenantRepository
  extends Omit<
    Repository<Tenant, TenantRepositoryOutput>,
    'delete' | 'update' | 'list'
  > {}

export { TenantRepository, TenantRepositoryOutput };
