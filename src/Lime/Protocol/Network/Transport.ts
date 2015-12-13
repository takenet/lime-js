namespace Lime {

  export interface ITransport {
    send(envelope: IEnvelope): void;
    onEnvelope: (envelope: IEnvelope) => any;

    open(uri: string): void;
    close(): void;
    stateListener: ITransportStateListener;

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
    onClosed: () => void;
    onError: (exception: string) => void;
  }
}
