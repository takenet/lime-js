export default class Authentication {
  scheme: AuthenticationScheme;
}
export class GuestAuthentication extends Authentication {
  scheme = AuthenticationScheme.GUEST;
}
export class TransportAuthentication extends Authentication {
  scheme = AuthenticationScheme.TRANSPORT;
}
export class PlainAuthentication extends Authentication {
  scheme = AuthenticationScheme.PLAIN;
  password: string;
  constructor(password: string) {
    super();
    this.password = password;
  }
}
export class KeyAuthentication extends Authentication {
  scheme = AuthenticationScheme.KEY;
  key: string;
  constructor(key: string) {
    super();
    this.key = key;
  }
}
export class ExternalAuthentication extends Authentication {
  scheme = AuthenticationScheme.EXTERNAL;
  token: string;
  issuer: string;
  constructor(token: string, issuer: string) {
    super();
    this.token = token;
    this.issuer = issuer;
  }
}

export const AuthenticationScheme = {
  GUEST: <AuthenticationScheme> "guest",
  PLAIN: <AuthenticationScheme> "plain",
  TRANSPORT: <AuthenticationScheme> "transport",
  KEY: <AuthenticationScheme> "key",
  EXTERNAL: <AuthenticationScheme> "external",
};
export type AuthenticationScheme
  = "guest"
  | "plain"
  | "transport"
  | "key"
  | "external"
  ;
