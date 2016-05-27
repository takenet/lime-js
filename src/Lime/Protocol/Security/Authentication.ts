export class Authentication {
  scheme: AuthenticationScheme;
}
export class GuestAuthentication extends Authentication {
  scheme = AuthenticationScheme.Guest;
}
export class TransportAuthentication extends Authentication {
  scheme = AuthenticationScheme.Transport;
}
export class PlainAuthentication extends Authentication {
  scheme = AuthenticationScheme.Plain;
  password: string;
}
export class KeyAuthentication extends Authentication {
  scheme = AuthenticationScheme.Key;
  key: string;
}

export const AuthenticationScheme = {
  Guest: <AuthenticationScheme> "guest",
  Plain: <AuthenticationScheme> "plain",
  Transport: <AuthenticationScheme> "transport",
  Key: <AuthenticationScheme> "key"
};
export type AuthenticationScheme
  = "guest"
  | "plain"
  | "transport"
  | "key"
  ;
