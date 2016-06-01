import {Envelope, EnvelopeListener} from "../Envelope";
import {SessionCompression, SessionEncryption} from "../Session";

export interface Transport extends EnvelopeListener {
  open(uri: string): void;
  close(): void;

  send(envelope: Envelope): void;

  getSupportedCompression(): SessionCompression[];
  setCompression(compression: SessionCompression): void;
  compression: SessionCompression;

  getSupportedEncryption(): SessionEncryption[];
  setEncryption(encryption: SessionEncryption): void;
  encryption: SessionEncryption;
}
