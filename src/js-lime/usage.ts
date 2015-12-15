
class MyChannel implements  IChannel {
  private _transport : ITransport;
  private _currentSession : ISession;

  get Transport(): ITransport {
      return this._transport;
  }

  constructor(transport : ITransport) {
    this._transport = transport;
  }

  connect(auth : IAuthentication) : Promise<ISession> {
    return this._transport.open()
      .then((session : ISession) => {
        this._currentSession = session;
        return this;
      });
  }

  onMessage(callback: onEnvelopeReceived<IMessage>) : void {
    undefined;
  }
  onNotification(callback: onEnvelopeReceived<INotification>) : void {
    undefined;
  }
  onCommand(callback: onEnvelopeReceived<ICommand>) : void {
    undefined;
  }
}

class MyTransport implements ITransport {
    open() : Promise<ISession> {
      return null;
    };

    close() : Promise<void> {
      return null;
    };

    onError(error : any) : void {
      undefined;
    };
}

/// USAGE ...

var channel = new MyChannel(new MyTransport());
channel.connect(new GuestAuthentication()).then((x : ISession) => {
  undefined;
}).catch((x : any) => {
  undefined;
});
