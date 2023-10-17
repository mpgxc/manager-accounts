import { AggregateRoot } from '@commons/domain';
import { Replace } from '@commons/logic';
import { Roles } from './roles';

type AccountProps = {
  name: string;
  username: string;
  password: string;
  lastName: string;
  phone: string;
  email: string;
  tenantCode: string;
  emailVerified: boolean;
  acceptedTerms: boolean;
  avatar: string;
  roles: Roles[];
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

class Account extends AggregateRoot<AccountProps> {
  private selfUpdate() {
    this._props.updatedAt = new Date();
  }

  set createdAt(createdAt: Date) {
    this._props.createdAt = createdAt;

    this.selfUpdate();
  }

  set emailVerified(emailVerified: boolean) {
    this._props.emailVerified = emailVerified;

    this.selfUpdate();
  }

  set avatar(avatar: string) {
    this._props.avatar = avatar;

    this.selfUpdate();
  }

  set lastAccess(lastAccess: Date) {
    this._props.lastAccess = lastAccess;

    this.selfUpdate();
  }

  set name(name: string) {
    this._props.name = name;

    this.selfUpdate();
  }

  set username(username: string) {
    this._props.username = username;

    this.selfUpdate();
  }

  set password(password: string) {
    this._props.password = password;

    this.selfUpdate();
  }

  set lastName(lastName: string) {
    this._props.lastName = lastName;

    this.selfUpdate();
  }

  set phone(phone: string) {
    this._props.phone = phone;

    this.selfUpdate();
  }

  set email(email: string) {
    this._props.email = email;

    this.selfUpdate();
  }

  set acceptedTerms(acceptedTerms: boolean) {
    this._props.acceptedTerms = acceptedTerms;

    this.selfUpdate();
  }

  set roles(roles: Roles[]) {
    this._props.roles = roles;

    this.selfUpdate();
  }

  public setAddRole(role: Roles) {
    this._props.roles.push(role);

    this.selfUpdate();
  }

  /**
   * @description Return all roles and permissions from account
   */
  public get rolePermissions() {
    return this._props.roles.map((role) => ({
      role: role.props.name,
      permissions: role.props.permissions.map(({ props }) => props.name),
    }));
  }

  static build(
    props: Replace<
      AccountProps,
      {
        roles?: Roles[];
        avatar?: string;
        updatedAt?: Date;
        createdAt?: Date;
        lastAccess?: Date;
        emailVerified?: boolean;
        acceptedTerms?: boolean;
      }
    >,
    id?: string,
  ) {
    const account = new Account(props as AccountProps, id);

    account.roles = props.roles?.length ? props.roles : [];
    account.avatar = props.avatar || '';
    account.createdAt = props.createdAt || new Date();
    account.lastAccess = props.lastAccess || new Date();
    account.emailVerified = props.emailVerified || false;
    account.acceptedTerms = props.acceptedTerms || false;

    return account;
  }
}

export { Account, AccountProps };
