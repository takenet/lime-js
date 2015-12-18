namespace Lime {

  export class ClientChannel extends Channel {

    constructor(transport: Transport, autoReplyPings: boolean = true, autoNotifyReceipt: boolean = false) {
      super(transport, autoReplyPings, autoNotifyReceipt);

      super.onSession = (s) => {
        this.sessionId = s.id;
        this.state = s.state;

        if (s.state === SessionState.established) {
          this.localNode = s.to;
          this.remoteNode = s.from;
        } else if (s.state === SessionState.finished || s.state === SessionState.failed) {
          try {
            this.transport.close();
          } catch (e) {
            console.error(e);
          }
        }

        switch (s.state) {
          case SessionState.negotiating:
            if (this.onSessionNegotiating != null) {
              this.onSessionNegotiating(s);
            }
            break;
          case SessionState.authenticating:
            if (this.onSessionAuthenticating != null) {
              this.onSessionAuthenticating(s);
            }
            break;
          case SessionState.established:
            if (this.onSessionEstablished != null) {
              this.onSessionEstablished(s);
            }
            break;
          case SessionState.finished:
            if (this.onSessionFinished != null) {
              this.onSessionFinished(s);
            }
            break;
          case SessionState.failed:
            if (this.onSessionFailed != null) {
              this.onSessionFailed(s);
            }
          default:
        }
      }
    }

    startNewSession() {
      if (this.state !== SessionState.new) {
        throw `Cannot start a session in the '${this.state}' state.`;
      }

      const session: Session = {
        state: SessionState.new
      };
      this.sendSession(session);
    }

    negotiateSession(sessionCompression: string, sessionEncryption: string) {
      if (this.state !== SessionState.negotiating) {
        throw `Cannot negotiate a session in the '${this.state}' state.`;
      }

      const session: Session = {
        id: this.sessionId,
        state: SessionState.negotiating,
        compression: sessionCompression,
        encryption: sessionEncryption
      };
      this.sendSession(session);
    }

    authenticateSession(identity: string, authentication: Authentication, instance: string) {
      if (this.state !== SessionState.authenticating) {
        throw `Cannot authenticate a session in the '${this.state}' state.`;
      }

      const session: Session = {
        id: this.sessionId,
        state: SessionState.authenticating,
        from: `${identity}/${instance}`,
        scheme: authentication.scheme || "unknown",
        authentication: authentication
      };
      this.sendSession(session);
    }

    sendFinishingSession() {
      if (this.state !== SessionState.established) {
        throw `Cannot finish a session in the '${this.state}' state.`;
      }

      const session: Session = {
        id: this.sessionId,
        state: SessionState.finishing
      };
      this.sendSession(session);
    }

    onSessionNegotiating(session: Session) {}
    onSessionAuthenticating(session: Session) {}
    onSessionEstablished(session: Session) {}
    onSessionFinished(session: Session) {}
    onSessionFailed(session: Session) {}
  }
}
