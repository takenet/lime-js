import {Message} from "../Message";
import {Notification} from "../Notification";
import {Command} from "../Command";
import {Session, SessionCompression, SessionEncryption, SessionState} from "../Session";
import {Channel} from "./Channel";
import {Transport} from "../Network/Transport";
import {Authentication} from "../Security/Authentication";

export class ClientChannel extends Channel {

  constructor(transport: Transport, autoReplyPings: boolean = true, autoNotifyReceipt: boolean = false) {
    super(transport, autoReplyPings, autoNotifyReceipt);
  }


  establishSession(compression: SessionCompression, encryption: SessionEncryption, identity: string, authentication: Authentication, instance: string, callback: (error: Error, session: Session) => void): void {
    if (this.state !== SessionState.New) {
      throw `Cannot establish a session in the '${this.state}' state.`;
    }

    this.onSessionNegotiating = (s) => {
      try {
        // Has encryption or compression options? ==> negotiate session with parameter or options
        if (s.encryptionOptions != null || s.compressionOptions != null) {
          this.negotiateSession(compression || s.compressionOptions[0], encryption || s.encryptionOptions[0]);
        } else {
          // Apply transport options
          if (s.compression !== this.transport.compression) {
            this.transport.setCompression(s.compression);
          }
          if (s.encryption !== this.transport.encryption) {
            this.transport.setEncryption(s.encryption);
          }
        }
      } catch (err) {
        this.removeListeners();
        callback(err, null);
      }
    }

    this.onSessionAuthenticating = (s) => {
      try {
        this.authenticateSession(identity, authentication, instance);
      } catch (err) {
        this.removeListeners();
        callback(err, null);
      }
    }

    this.onSessionEstablished = this.onSessionFailed = (s) => {
      this.removeListeners();
      callback(null, s);
    };

    try {
      this.startNewSession();
    } catch (err) {
      this.removeListeners();
      callback(err, null);
    }
  }

  private removeListeners(): void {
    this.onSessionNegotiating = null;
    this.onSessionAuthenticating = null;
    this.onSessionEstablished = null;
    this.onSessionFailed = null;
  }

  onMessage(message: Message) {}
  onNotification(notification: Notification) {}
  onCommand(command: Command) {}

  onSession(session: Session) {
    this.sessionId = session.id;
    this.state = session.state;

    if (session.state === SessionState.Established) {
      this.localNode = session.to;
      this.remoteNode = session.from;
    } else if (session.state === SessionState.Finished || session.state === SessionState.Failed) {
      try {
        this.transport.close();
      } catch (e) {
        console.error(e);
      }
    }

    switch (session.state) {
      case SessionState.Negotiating:
        this.onSessionNegotiating(session);
        break;
      case SessionState.Authenticating:
        this.onSessionAuthenticating(session);
        break;
      case SessionState.Established:
        this.onSessionEstablished(session);
        break;
      case SessionState.Finished:
        this.onSessionFinished(session);
        break;
      case SessionState.Failed:
        this.onSessionFailed(session);
      default:
    }
  }

  startNewSession() {
    if (this.state !== SessionState.New) {
      throw `Cannot start a session in the '${this.state}' state.`;
    }

    const session: Session = {
      state: SessionState.New
    };
    this.sendSession(session);
  }

  negotiateSession(sessionCompression: SessionCompression, sessionEncryption: SessionEncryption) {
    if (this.state !== SessionState.Negotiating) {
      throw `Cannot negotiate a session in the '${this.state}' state.`;
    }

    const session: Session = {
      id: this.sessionId,
      state: SessionState.Negotiating,
      compression: sessionCompression,
      encryption: sessionEncryption
    };
    this.sendSession(session);
  }

  authenticateSession(identity: string, authentication: Authentication, instance: string) {
    if (this.state !== SessionState.Authenticating) {
      throw `Cannot authenticate a session in the '${this.state}' state.`;
    }

    const session: Session = {
      id: this.sessionId,
      state: SessionState.Authenticating,
      from: `${identity}/${instance}`,
      scheme: authentication.scheme || "unknown",
      authentication: authentication
    };
    this.sendSession(session);
  }

  sendFinishingSession() {
    if (this.state !== SessionState.Established) {
      throw `Cannot finish a session in the '${this.state}' state.`;
    }

    const session: Session = {
      id: this.sessionId,
      state: SessionState.Finishing
    };
    this.sendSession(session);
  }

  onSessionNegotiating(session: Session) {}
  onSessionAuthenticating(session: Session) {}
  onSessionEstablished(session: Session) {}
  onSessionFinished(session: Session) {}
  onSessionFailed(session: Session) {}
}
