namespace Lime {
  export class Authentication {
    scheme: string;

    static guest = "guest";
    static plain = "plain";
    static transport = "transport";
    static key = "key";
  }
  export class GuestAuthentication extends Authentication {
    scheme = Authentication.guest;
  }
  export class TransportAuthentication extends Authentication {
    scheme = Authentication.transport;
  }
  export class PlainAuthentication extends Authentication {
    scheme = Authentication.plain;
    password: string;
  }
  export class KeyAuthentication extends Authentication {
    scheme = Authentication.key;
    key: string;
  }
}