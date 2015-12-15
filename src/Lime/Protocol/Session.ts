namespace Lime {

  export interface ISession extends IEnvelope {
    state: string;

    encryptionOptions?: string[];
    encryption?: string;

    compressionOptions?: string[];
    compression?: string;

    scheme?: string;
    authentication?: any;

    reason?: IReason;
  }

  export class SessionState {
    static new = "new";
    static negotiating = "negotiating";
    static authenticating = "authenticating";
    static established = "established";
    static finishing = "finishing";
    static finished = "finished";
    static failed = "failed";
  }

  export class SessionEncryption {
    static none = "none";
    static tls = "tls";
  }

  export class SessionCompression {
    static none = "none";
    static gzip = "gzip";
  }
}
