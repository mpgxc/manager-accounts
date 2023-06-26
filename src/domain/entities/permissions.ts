import { Entity } from 'commons/domain';
import { Replace } from 'commons/logic';

type PermissionsProps = {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class Permissions extends Entity<PermissionsProps> {
  static build(
    props: Replace<
      PermissionsProps,
      {
        createdAt?: Date;
      }
    >,
    id?: string,
  ): Permissions {
    return new Permissions(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }
}

export { Permissions, PermissionsProps };
