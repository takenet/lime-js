export class Authentication {
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
}
export class KeyAuthentication extends Authentication {
  scheme = AuthenticationScheme.KEY;
  key: string;
}

export const AuthenticationScheme = {
  GUEST: <AuthenticationScheme> "guest",
  PLAIN: <AuthenticationScheme> "plain",
  TRANSPORT: <AuthenticationScheme> "transport",
  KEY: <AuthenticationScheme> "key"
};
export type AuthenticationScheme
  = "guest"
  | "plain"
  | "transport"
  | "key"
  ;
