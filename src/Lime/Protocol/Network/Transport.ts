namespace Lime {

  export interface ITransport extends ITransportStateListener {
    send(envelope: IEnvelope): void;
    onEnvelope: (envelope: IEnvelope) => any;

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
    (envelope: IEnvelope): void;
  }

  export interface ITransportStateListener {
    onOpen: () => void;
    onClose: () => void;
    onError: (error: string) => void;
  }
}
