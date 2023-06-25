import { Entity } from 'commons/domain';
import { Replace } from 'commons/logic';
import { Permissions } from './permissions';

type RolesProps = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permissions[];
};

class Roles extends Entity<RolesProps> {
  private selfUpdate() {
    this._props.updatedAt = new Date();
  }

  set permissions(permissions: Permissions[]) {
    this._props.permissions = permissions;

    this.selfUpdate();
  }

  public addPermission(permission: Permissions) {
    this._props.permissions.push(permission);

    this.selfUpdate();
  }

  static build(
    props: Replace<
      RolesProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
        permissions?: Permissions[];
      }
    >,
    id?: string,
  ): Roles {
    return new Roles(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        permissions: props.permissions || [],
      },
      id,
    );
  }
}

export { Roles, RolesProps };
