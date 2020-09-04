import Message from "../Message";
import Notification from "../Notification";
import Command from "../Command";
import Session, { SessionCompression, SessionEncryption, SessionState } from "../Session";
import Channel from "./Channel";
import Transport from "../Network/Transport";
import Authentication from "../Security/Authentication";
import * as Promise from "bluebird";

export default class ClientChannel extends Channel {

  constructor(transport: Transport, autoReplyPings: boolean = true, autoNotifyReceipt: boolean = false) {
    super(transport, autoReplyPings, autoNotifyReceipt);
  }

  establishSession(compression: SessionCompression, encryption: SessionEncryption, identity: string, authentication: Authentication, instance: string): Promise<Session> {
    if (this.state !== SessionState.NEW) {
      throw new Error(`Cannot establish a session in the '${this.state}' state.`);
    }

    return this.startNewSession()
      .then((session) => {
        if (session.encryptionOptions != null || session.compressionOptions != null) {
          return this.negotiateSession(compression || session.compressionOptions[0], encryption || session.encryptionOptions[0]);
        }

        // Apply transport options
        if (session.compression !== this.transport.compression) {
          this.transport.setCompression(session.compression);
        }
        if (session.encryption !== this.transport.encryption) {
          this.transport.setEncryption(session.encryption);
        }
        return session;
      })
      .then((session) => this.authenticateSession(identity, authentication, instance))
      .then((session) => {
        this._resetSessionListeners();
        return session;
      });
  }

  onMessage(message: Message) {}
  onNotification(notification: Notification) {}
  onCommand(command: Command) {}

  onSession(session: Session) {
    this.sessionId = session.id;
    this.state = session.state;

    if (session.state === SessionState.ESTABLISHED) {
      this.localNode = session.to.toString();
      this.remoteNode = session.from;
    }

    switch (session.state) {
      case SessionState.NEGOTIATING:
        this._onSessionNegotiating(session);
        break;
      case SessionState.AUTHENTICATING:
        this._onSessionAuthenticating(session);
        break;
      case SessionState.ESTABLISHED:
        this._onSessionEstablished(session);
        break;
      case SessionState.FINISHED:
        this.transport.close().then(() => {
          this.onSessionFinished(session);
          this._onSessionFinished(session);
        });
        break;
      case SessionState.FAILED:
        this.transport.close().then(() => {
          this.onSessionFailed(session);
          this._onSessionFailed(session);
        });
      default:
    }
  }

  startNewSession(): Promise<Session> {
    if (this.state !== SessionState.NEW) {
      throw new Error(`Cannot start a session in the '${this.state}' state.`);
    }

    let promise = new Promise<Session>((resolve, reject) => {
      this._onSessionFailed = reject;
      this._onSessionNegotiating = this._onSessionAuthenticating = resolve;
    });

    const session: Session = {
      state: SessionState.NEW
    };
    this.sendSession(session);

    return promise;
  }

  negotiateSession(sessionCompression: SessionCompression, sessionEncryption: SessionEncryption): Promise<Session> {
    if (this.state !== SessionState.NEGOTIATING) {
      throw new Error(`Cannot negotiate a session in the '${this.state}' state.`);
    }

    let promise = new Promise<Session>((resolve, reject) => {
      this._onSessionFailed = reject;
      this._onSessionAuthenticating = resolve;
    });

    const session: Session = {
      id: this.sessionId,
      state: SessionState.NEGOTIATING,
      compression: sessionCompression,
      encryption: sessionEncryption
    };
    this.sendSession(session);

    return promise;
  }

  authenticateSession(identity: string, authentication: Authentication, instance: string): Promise<Session> {
    if (this.state !== SessionState.AUTHENTICATING) {
      throw new Error(`Cannot authenticate a session in the '${this.state}' state.`);
    }

    let promise = new Promise<Session>((resolve, reject) => {
      this._onSessionFailed = reject;
      this._onSessionEstablished = resolve;
    });

    const session: Session = {
      id: this.sessionId,
      state: SessionState.AUTHENTICATING,
      from: `${identity}/${instance}`,
      scheme: authentication.scheme || "unknown",
      authentication: authentication
    };
    this.sendSession(session);

    return promise;
  }

  sendFinishingSession(): Promise<Session> {
    if (this.state !== SessionState.ESTABLISHED) {
      throw new Error(`Cannot finish a session in the '${this.state}' state.`);
    }

    let promise = new Promise<Session>((resolve, reject) => {
      this._onSessionFailed = reject;
      this._onSessionFinished = resolve;
    });

    const session: Session = {
      id: this.sessionId,
      state: SessionState.FINISHING
    };
    this.sendSession(session);

    return promise;
  }

  onSessionFinished(session: Session) {}
  onSessionFailed(session: Session) {}

  private _resetSessionListeners() {
    this._onSessionNegotiating =
      this._onSessionAuthenticating =
      this._onSessionEstablished =
      this._onSessionFinished =
      this._onSessionFailed = () => {};
  }

  private _onSessionNegotiating(session: Session) {}
  private _onSessionAuthenticating(session: Session) {}
  private _onSessionEstablished(session: Session) {}
  private _onSessionFinished(session: Session) {}
  private _onSessionFailed(session: Session) {}
}
