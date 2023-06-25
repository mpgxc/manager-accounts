const RegexPatternsEnum = Object.freeze({
  AUTHORIZATION_HEADER:
    /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/,

  TENANT_HEADER: /^tenant_[a-zA-Z0-9-]+$/,
});

export { RegexPatternsEnum };
