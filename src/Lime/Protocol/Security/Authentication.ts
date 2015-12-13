namespace Lime {

  export class AuthenticationScheme {
    static guest = "guest";
    static plain = "plain";
    static transport = "transport";
    static key = "key";
  }

  export interface IAuthentication {
    scheme: string;
  }
  export class GuestAuthentication implements IAuthentication {
    scheme = AuthenticationScheme.guest;
  }
  export class TransportAuthentication implements IAuthentication {
    scheme = AuthenticationScheme.transport;
  }
  export class PlainAuthentication implements IAuthentication {
    scheme = AuthenticationScheme.plain;
    password: string;
  }
  export class KeyAuthentication implements IAuthentication {
    scheme = AuthenticationScheme.key;
    key: string;
  }
}
