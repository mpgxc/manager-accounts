import { Observable } from 'rxjs';

export const SecretsManagerPackage = Symbol('SECRETS_PACKAGE');

export const SecretsManagerService = 'SecretsService';

export type SecretsManagerkey = {
  key: string;
};

export type SecretsManagerOutput = {
  key: string;
  /**
   * No futuro, pode ser que tenha mais chaves
   */
  value: Record<
    | 'jwt_public_key'
    | 'jwt_secret_key'
    | 'jwt_refresh_public_key'
    | 'jwt_refresh_secret_key',
    string
  >;
};

export interface SecretsManagerProvider {
  get(key: SecretsManagerkey): Observable<SecretsManagerOutput>;
}
