namespace Lime {

  export interface Transport extends ITransportStateListener {
    send(envelope: Envelope): void;
    onEnvelope: (envelope: Envelope) => any;

    open(uri: string): void;
    close(): void;

    getSupportedCompression(): string[];
    setCompression(compression: string): void;
    compression: string;

    getSupportedEncryption(): string[];
    setEncryption(encryption: string): void;
    encryption: string;
  }

  export interface ITransportEnvelopeListener {
    (envelope: Envelope): void;
  }

  export interface ITransportStateListener {
    onOpen: () => void;
    onClose: () => void;
    onError: (error: string) => void;
  }
}
