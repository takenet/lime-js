import Envelope, { EnvelopeListener } from "../Envelope";
import { SessionCompression, SessionEncryption } from "../Session";
import * as Promise from "bluebird";

interface Transport extends EnvelopeListener {
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

export default Transport;
