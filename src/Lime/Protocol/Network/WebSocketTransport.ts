import {Envelope} from "../Envelope";
import {SessionCompression, SessionEncryption} from "../Session";
import {Transport} from "./Transport";

export class WebSocketTransport implements Transport {
  private traceEnabled: boolean;
  webSocket: WebSocket;

  constructor(traceEnabled: boolean = false) {
    this.traceEnabled = traceEnabled;
  }

  send(envelope: Envelope) {
    this.ensureSocketOpen();
    const envelopeString = JSON.stringify(envelope);
    this.webSocket.send(envelopeString);

    if (this.traceEnabled) {
      console.debug(`WebSocket SEND: ${envelopeString}`);
    }
  }

  onEnvelope(envelope: Envelope) { }

  open(uri: string) {
    this.webSocket = new WebSocket(uri, "lime");

    if (uri.indexOf("wss://") > -1) {
      this.encryption = SessionEncryption.TLS;
    } else {
      this.encryption = SessionEncryption.NONE;
    }

    this.compression = SessionCompression.NONE;

    this.webSocket.onmessage = (e) => {
      if (this.traceEnabled) {
        console.debug(`WebSocket RECEIVE: ${e.data}`);
      }
      this.onEnvelope(<Envelope>JSON.parse(e.data));
    }

    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = (e) => {
      this.onError(new Error(e.toString()));
    }
  }

  close() {
    this.ensureSocketOpen();
    this.webSocket.close();
  }

  private ensureSocketOpen() {
    if(this.webSocket == null ||
      this.webSocket.readyState !== WebSocket.OPEN) {
      throw "The connection is not open";
    }
  }

  getSupportedCompression(): SessionCompression[] {
    throw new Error("Compression change is not supported");
  }
  setCompression(compression: SessionCompression): void {}
  compression: SessionCompression;

  getSupportedEncryption(): SessionEncryption[] {
    throw new Error("Encryption change is not supported");
  }
  setEncryption(encryption: SessionEncryption): void {}
  encryption: SessionEncryption;

  onOpen(): void {}
  onClose(): void {}
  onError(error: Error) {}
}
