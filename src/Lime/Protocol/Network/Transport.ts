import {Envelope} from "../Envelope";

export interface ITransport extends ITransportStateListener {
  send(envelope: Envelope): void;
  onEnvelope: (envelope: Envelope) => void;

  open(uri: string): void;
  close(): void;

  getSupportedCompression(): string[];
  setCompression(compression: string): void;
  compression: string;

  getSupportedEncryption(): string[];
  setEncryption(encryption: string): void;
  encryption: string;
  
  isConnected(): boolean;
}

export interface ITransportEnvelopeListener {
  (envelope: Envelope): void;
}

export interface ITransportStateListener {
  onOpen: () => void;
  onClose: () => void;
  onError: (error: Error) => void;
}
