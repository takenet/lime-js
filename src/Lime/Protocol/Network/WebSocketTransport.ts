namespace Lime {
  
  export class WebSocketTransport implements ITransport {
    private traceEnabled: boolean;
    webSocket: WebSocket;

    constructor(traceEnabled: boolean = false) {
      this.traceEnabled = traceEnabled;
    }

    send(envelope: IEnvelope) {
      this.ensureSocketOpen();
      const envelopeString = JSON.stringify(envelope);
      this.webSocket.send(
        envelopeString);

      if (this.traceEnabled) {
        console.debug(`SEND: ${envelopeString}`);
      }
    }

    onEnvelope(envelope: IEnvelope) { }

    open(uri: string) {
      this.webSocket = new WebSocket(uri, "lime");

      if (uri.indexOf("wss://") > -1) {
        this.encryption = SessionEncryption.tls;
      } else {
        this.encryption = SessionEncryption.none;
      }

      this.compression = SessionCompression.none;

      this.webSocket.onmessage = e => {
        if (this.traceEnabled) {
          console.debug(`RECEIVE: ${e.data}`);
        }

        const object = JSON.parse(e.data);
        let envelope: IEnvelope;
        if (object.hasOwnProperty("event")) {
          envelope = <INotification>object;
        } else if (object.hasOwnProperty("content")) {
          envelope = <IMessage>object;
        } else if (object.hasOwnProperty("method")) {
          envelope = <ICommand>object;
        } else if (object.hasOwnProperty("state")) {
          envelope = <ISession>object;
        } else {
          return;
        }
        this.onEnvelope(envelope);
      }

      this.webSocket.onopen = e => {
        if (this.stateListener != null) {
          this.stateListener.onOpen();
        }
      }
      this.webSocket.onclose = e => {
        if (this.stateListener != null) {
          this.stateListener.onClosed();
        }
        this.webSocket = null;
      }
      this.webSocket.onerror = e => {
        if (this.stateListener != null) {
          this.stateListener.onError(e.toString());
        }
        this.webSocket = null;
        console.log(e);
      }
    }

    close() {
      this.ensureSocketOpen();
      this.webSocket.close();
    }

    stateListener: ITransportStateListener;

    private ensureSocketOpen() {
      if(this.webSocket == null ||
        this.webSocket.readyState !== WebSocket.OPEN) {
        throw "The connection is not open";
      }
    }

    getSupportedCompression(): string[] { throw new Error("Encryption change is not supported"); }
    setCompression(compression: string): void {}
    compression: string;

    getSupportedEncryption(): string[] { throw new Error("Encryption change is not supported"); }
    setEncryption(encryption: string): void {}
    encryption: string;
  }
}
