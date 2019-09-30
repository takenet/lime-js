// Type definitions for lime-js 0.0.3
// Project: https://github.com/takenet/lime-js
// Definitions by: Arthur Xavier <https://github.com/arthur-xavier>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "lime-js" {

  // Lime.Envelope
  interface Envelope {
    id?: string;
    from?: string;
    to?: string;
    pp?: string;
    metadata?: any;
  }
  const Envelope: {
    isMessage: (envelope: Envelope) => envelope is Message;
    isNotification: (envelope: Envelope) => envelope is Notification;
    isCommand: (envelope: Envelope) => envelope is Command;
    isSession: (envelope: Envelope) => envelope is Session;
  }
  interface Reason {
    code: number;
    description?: string;
  }
  interface EnvelopeListener {
    onEnvelope(envelope: Envelope): void
  }

  // Lime.Message
  interface Message extends Envelope {
    type: string;
    content: any;
  }
  interface MessageListener {
    onMessage(command: Message): void;
  }

  // Lime.Notification
  interface Notification extends Envelope {
    event: NotificationEvent;
    reason?: Reason;
  }
  interface NotificationListener {
    onNotification(command: Notification): void;
  }
  const NotificationEvent: {
    ACCEPTED: NotificationEvent;
    VALIDATED: NotificationEvent;
    AUTHORIZED: NotificationEvent;
    DISPATCHED: NotificationEvent;
    RECEIVED: NotificationEvent;
    CONSUMED: NotificationEvent;
  }
  type NotificationEvent
    = "accepted"
    | "validated"
    | "authorized"
    | "dispatched"
    | "received"
    | "consumed"
    ;

  // Lime.Command
  interface Command extends Envelope {
    uri?: string;
    type?: string;
    resource?: any;
    method: CommandMethod;
    status?: CommandStatus;
    reason?: Reason;
  }
  interface CommandListener {
    onCommand(command: Command): void;
  }
  const CommandMethod: {
    GET: CommandMethod;
    SET: CommandMethod;
    DELETE: CommandMethod;
    OBSERVE: CommandMethod;
    SUBSCRIBE: CommandMethod;
  }
  type CommandMethod
    = "get"
    | "set"
    | "delete"
    | "observe"
    | "subscribe"
    ;
  const CommandStatus: {
    SUCCESS: CommandStatus;
    FAILURE: CommandStatus;
  }
  type CommandStatus
    = "success"
    | "failure"
    ;

  // Lime.Session
  interface Session extends Envelope {
    state: SessionState;

    encryptionOptions?: SessionEncryption[];
    encryption?: SessionEncryption;

    compressionOptions?: SessionCompression[];
    compression?: SessionCompression;

    scheme?: string;
    authentication?: any;

    reason?: Reason;
  }
  interface SessionListener {
    onSession(command: Session): void;
  }
  const SessionState: {
    NEW: SessionState;
    NEGOTIATING: SessionState;
    AUTHENTICATING: SessionState;
    ESTABLISHED: SessionState;
    FINISHING: SessionState;
    FINISHED: SessionState;
    FAILED: SessionState;
  }
  type SessionState
    = "new"
    | "negotiating"
    | "authenticating"
    | "established"
    | "finishing"
    | "finished"
    | "failed"
    ;
  const SessionEncryption: {
    NONE: SessionEncryption;
    TLS: SessionEncryption;
  }
  type SessionEncryption
    = "none"
    | "tls"
    ;
  const SessionCompression: {
    NONE: SessionCompression;
    GZIP: SessionCompression;
  }
  type SessionCompression
    = "none"
    | "gzip"
    ;

  // Lime.Security.Authentication
  class Authentication {
    scheme: AuthenticationScheme;
  }
  class GuestAuthentication extends Authentication {}
  class TransportAuthentication extends Authentication {}
  class PlainAuthentication extends Authentication {
    password: string;
  }
  class KeyAuthentication extends Authentication {
    key: string;
  }
  const AuthenticationScheme: {
    GUEST: AuthenticationScheme;
    PLAIN: AuthenticationScheme;
    TRANSPORT: AuthenticationScheme;
    KEY: AuthenticationScheme;
  }
  type AuthenticationScheme
    = "guest"
    | "plain"
    | "transport"
    | "key"
    ;

  // Lime.Client.Channel
  interface MessageChannel extends MessageListener {
    sendMessage(message: Message): void;
  }
  interface CommandChannel extends CommandListener {
    sendCommand(command: Command): void;
  }
  interface NotificationChannel extends NotificationListener {
    sendNotification(notification: Notification): void;
  }
  interface SessionChannel extends SessionListener {
    sendSession(session: Session): void;
  }
  interface CommandProcessor extends CommandListener {
    processCommand(command: Command, timeout: number): Promise<any>;
  }
  abstract class Channel implements MessageChannel, CommandChannel, NotificationChannel, SessionChannel, CommandProcessor {
    transport: Transport;
    remoteNode: string;
    localNode: string;
    sessionId: string;
    state: SessionState;
    commandTimeout: number;

    constructor(transport: Transport, autoReplyPings: boolean, autoNotifyReceipt: boolean);

    sendMessage(message: Message): void;
    abstract onMessage(message: Message): void;

    sendCommand(command: Command): void;
    abstract onCommand(message: Command): void;

    sendNotification(notification: Notification): void;
    abstract onNotification(message: Notification): void;

    sendSession(session: Session): void;
    abstract onSession(message: Session): void;

    processCommand(command: Command, timeout: number): Promise<any>;
  }
  // Lime.Client.ClientChannel
  class ClientChannel extends Channel {
    constructor(transport: Transport, autoReplyPings?: boolean, autoNotifyReceipt?: boolean);
    establishSession(compression: SessionCompression, encryption: SessionEncryption, identity: string, authentication: Authentication, instance: string, callback: (error: Error, session: Session) => void): void;

    startNewSession(): void;
    negotiateSession(sessionCompression: SessionCompression, sessionEncryption: SessionEncryption): void;
    authenticateSession(identity: string, authentication: Authentication, instance: string): void;
    sendFinishingSession(): void;

    onSessionNegotiating(session: Session): void;
    onSessionAuthenticating(session: Session): void;
    onSessionEstablished(session: Session): void;
    onSessionFinished(session: Session): void;
    onSessionFailed(session: Session): void;

    onMessage(message: Message): void;
    onCommand(message: Command): void;
    onNotification(message: Notification): void;
    onSession(message: Session): void;
  }

  // Lime.Network.Transport
  interface Transport extends EnvelopeListener {
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
}
