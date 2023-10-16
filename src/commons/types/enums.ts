const RegexPatterns = Object.freeze({
  AUTHORIZATION_HEADER:
    /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/,

  TENANT_HEADER: /^tenant_[a-zA-Z0-9-]+$/,
});

enum CacheTTL {
  PERSIST = 0,
  ONE_MINUTE = 60 * 1000,
  ONE_HOUR = 60 * 60 * 1000,
  ONE_DAY = 24 * 60 * 60 * 1000,
}

export { CacheTTL, RegexPatterns };
