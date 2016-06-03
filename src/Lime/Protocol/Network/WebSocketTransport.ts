import {Envelope} from "../Envelope";
import {SessionCompression, SessionEncryption} from "../Session";
import {Transport} from "./Transport";
import {Promise} from "es6-promise";

export class WebSocketTransport implements Transport {

  private traceEnabled: boolean;
  webSocket: WebSocket;

  constructor(traceEnabled: boolean = false) {
    this.traceEnabled = traceEnabled;
  }

  open(uri: string): Promise<void> {
    this.webSocket = new WebSocket(uri, "lime");

    if (uri.indexOf("wss://") > -1) {
      this.encryption = SessionEncryption.TLS;
    } else {
      this.encryption = SessionEncryption.NONE;
    }

    this.compression = SessionCompression.NONE;

    let promise = new Promise<void>((resolve, reject) => {
      this.webSocket.onopen = () => {
        resolve();
        this.onOpen();
      };
      this.webSocket.onerror = (e) => {
        let err = new Error(e.toString());
        reject(err);
        this.onError(err);
      }
    });

    this.webSocket.onclose = this.onClose;
    this.webSocket.onmessage = (e) => {
      if (this.traceEnabled) {
        console.debug(`WebSocket RECEIVE: ${e.data}`);
      }
      this.onEnvelope(<Envelope>JSON.parse(e.data));
    }

    return promise;
  }

  close(): Promise<void> {
    this.ensureSocketOpen();

    let promise = new Promise<void>((resolve, reject) => {
      this.webSocket.onclose = () => {
        resolve();
        this.onClose();
      };
      this.webSocket.onerror = (e) => {
        let err = new Error(e.toString());
        reject(err);
        this.onError(err);
      }
    });

    this.webSocket.close();

    return promise;
  }

  private ensureSocketOpen() {
    if(this.webSocket == null ||
      this.webSocket.readyState !== WebSocket.OPEN) {
      throw "The connection is not open";
    }
  }

  send(envelope: Envelope) {
    this.ensureSocketOpen();
    const envelopeString = JSON.stringify(envelope);
    this.webSocket.send(envelopeString);

    if (this.traceEnabled) {
      console.debug(`WebSocket SEND: ${envelopeString}`);
    }
  }

  onEnvelope(envelope: Envelope) {}

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
