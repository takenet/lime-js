import {IEnvelope, Reason} from "./Envelope";

export interface Session extends IEnvelope {
  state: SessionState;

  encryptionOptions?: SessionEncryption[];
  encryption?: SessionEncryption;

  compressionOptions?: SessionCompression[];
  compression?: SessionCompression;

  scheme?: string;
  authentication?: any;

  reason?: Reason;
}

export interface ISessionListener {
  onSession(command: Session): void;
}

export const SessionState = {
  New: <SessionState> "new",
  Negotiating: <SessionState> "negotiating",
  Authenticating: <SessionState> "authenticating",
  Established: <SessionState> "established",
  Finishing: <SessionState> "finishing",
  Finished: <SessionState> "finished",
  Failed: <SessionState> "failed",
};
export type SessionState
  = "new"
  | "negotiating"
  | "authenticating"
  | "established"
  | "finishing"
  | "finished"
  | "failed"
  ;

export const SessionEncryption = {
  none: <SessionEncryption> "none",
  tls: <SessionEncryption> "tls"
};
export type SessionEncryption
  = "none"
  | "tls"
  ;

export const SessionCompression = {
  none: <SessionCompression> "none",
  gzip: <SessionCompression> "gzip"
};
export type SessionCompression
  = "none"
  | "gzip"
  ;
