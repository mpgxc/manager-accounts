export type TokenOptions = {
  issuer: string;
  subject: string;
};

export interface TokensProvider {
  buildAccessToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string>;

  buildRefreshToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string>;
}
