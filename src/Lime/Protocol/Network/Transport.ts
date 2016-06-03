import {Envelope, EnvelopeListener} from "../Envelope";
import {SessionCompression, SessionEncryption} from "../Session";
import {Promise} from "es6-promise";

export interface Transport extends EnvelopeListener {
  open(uri: string): Promise<void>;
  close(): Promise<void>;

  send(envelope: Envelope): void;

  getSupportedCompression(): SessionCompression[];
  setCompression(compression: SessionCompression): void;
  compression: SessionCompression;

  getSupportedEncryption(): SessionEncryption[];
  setEncryption(encryption: SessionEncryption): void;
  encryption: SessionEncryption;
}
