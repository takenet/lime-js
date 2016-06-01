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
  NEW: <SessionState> "new",
  NEGOTIATING: <SessionState> "negotiating",
  AUTHENTICATING: <SessionState> "authenticating",
  ESTABLISHED: <SessionState> "established",
  FINISHING: <SessionState> "finishing",
  FINISHED: <SessionState> "finished",
  FAILED: <SessionState> "failed",
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
  NONE: <SessionEncryption> "none",
  TLS: <SessionEncryption> "tls"
};
export type SessionEncryption
  = "none"
  | "tls"
  ;

export const SessionCompression = {
  NONE: <SessionCompression> "none",
  GZIP: <SessionCompression> "gzip"
};
export type SessionCompression
  = "none"
  | "gzip"
  ;
