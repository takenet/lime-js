namespace Lime {

  export class ClientChannelExtensions {

    static establishSession(clientChannel: IClientChannel, compression: string, encryption: string, identity: string, authentication: any, instance: string, listener: IEstablishSessionListener): void {
      if (clientChannel.state !== SessionState.new) {
        throw `Cannot establish a session in the '${clientChannel.state}' state.`;
      }

      clientChannel.onSessionNegotiating = s => {
        try {

          if (s.encryptionOptions != null || s.compressionOptions != null) {
            let sessionCompression = compression;
            if (sessionCompression === null) {
              sessionCompression = s.compressionOptions[0];
            }

            let sessionEncryption = encryption;
            if (sessionEncryption === null) {
              sessionEncryption = s.encryptionOptions[0];
            }

            clientChannel.negotiateSession(sessionCompression, sessionEncryption);

          } else {
            // Apply transport options
            if (s.compression !== clientChannel.transport.compression) {
              clientChannel.transport.setCompression(s.compression);
            }

            if (s.encryption !== clientChannel.transport.encryption) {
              clientChannel.transport.setEncryption(s.encryption);
            }
          }
        } catch (e1) {
          this.onFailure(clientChannel, listener, e1);
        }
      }

      clientChannel.onSessionAuthenticating = s => {
          try {
              clientChannel.authenticateSession(identity, authentication, instance);
          } catch (e2) {
              this.onFailure(clientChannel, listener, e2);
          }
      }

      clientChannel.onSessionEstablished = s => {
          this.onResult(clientChannel, listener, s);
      }

      clientChannel.onSessionFailed = s => {
          this.onResult(clientChannel, listener, s);
      }

      try {
          clientChannel.startNewSession();
      } catch (e) {
          this.onFailure(clientChannel, listener, e);
      }
    }

    private static onResult(clientChannel: IClientChannel, listener: IEstablishSessionListener, session: ISession): void {
      this.removeListeners(clientChannel);
      listener.onResult(session);
    }

    private static onFailure(clientChannel: IClientChannel, listener: IEstablishSessionListener, exception: string): void {
      this.removeListeners(clientChannel);
      listener.onFailure(exception);
    }

    private static removeListeners(clientChannel: IClientChannel): void {
      clientChannel.onSessionNegotiating = null;
      clientChannel.onSessionAuthenticating = null;
      clientChannel.onSessionEstablished = null;
      clientChannel.onSessionFailed = null;
    }
  }
}
