import {Envelope, IEnvelopeListener} from "../Envelope";
import {SessionCompression, SessionEncryption} from "../Session";

export interface Transport extends IEnvelopeListener {
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
