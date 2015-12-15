interface ITransport {
  open() : Promise<ISession>;
  close() : Promise<void>;
  onError(error : any) : void;
}

interface IChannel {

  Transport : ITransport;

  connect(auth : IAuthentication) : Promise<ISession>;
  onMessage(callback: onEnvelopeReceived<IMessage>) : void;
  onNotification(callback: onEnvelopeReceived<INotification>) : void;
  onCommand(callback: onEnvelopeReceived<ICommand>) : void;
}

interface onEnvelopeReceived<T>  {
  (response: T): any;
}

interface ISession {

}

interface IMessage { }
interface INotification { }
interface ICommand { }
class AuthenticationScheme {
  static guest = "guest";
  static plain = "plain";
  static transport = "transport";
  static key = "key";
}

interface IAuthentication { scheme: string; }
class GuestAuthentication implements IAuthentication { scheme = AuthenticationScheme.guest; }
class TransportAuthentication implements IAuthentication { scheme = AuthenticationScheme.transport; }
class PlainAuthentication implements IAuthentication { scheme = AuthenticationScheme.plain; password: string; }
class KeyAuthentication implements IAuthentication { scheme = AuthenticationScheme.key; key: string; }
