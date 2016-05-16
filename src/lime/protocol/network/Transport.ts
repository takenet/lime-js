namespace lime {
  export interface Transport extends TransportStateListener {
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

  export interface TransportEnvelopeListener {
    (envelope: Envelope): void;
  }

  export interface TransportStateListener {
    onOpen: () => void;
    onClose: () => void;
    onError: (error: Error) => void;
  }
}