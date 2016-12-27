import Envelope, { EnvelopeListener } from "../Envelope";
import { SessionCompression, SessionEncryption } from "../Session";
import Transport from './Transport';
import * as Promise from "bluebird";

export default class WrappedTransport implements Transport {

  _transport: Transport;

  constructor(transport) {
    this._transport = transport;
  }

  open(uri: string): Promise<void> {
    return this._transport.open(uri);
  }

  close(): Promise<void> {
    return this._transport.close();
  }

  send(envelope: Envelope): void {
    this._transport.send(envelope);
  }

  onEnvelope(envelope: Envelope): void {
    this._transport.onEnvelope(envelope);
  }

  getSupportedCompression(): SessionCompression[] {
    return this._transport.getSupportedCompression();
  }
  setCompression(compression: SessionCompression): void {
    this._transport.setCompression(compression);
  }
  get compression(): SessionCompression {
    return this._transport.compression;
  }

  getSupportedEncryption(): SessionEncryption[] {
    return this._transport.getSupportedEncryption();
  }
  setEncryption(encryption: SessionEncryption): void {
    this._transport.setEncryption(encryption);
  }
  get encryption(): SessionEncryption {
    return this._transport.encryption;
  }
}
