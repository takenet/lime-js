namespace Lime {

  export class ClientChannelExtensions {

    static establishSession(clientChannel: IClientChannel, compression: string, encryption: string, identity: string, authentication: IAuthentication, instance: string, listener: IEstablishSessionListener): void {
      if (clientChannel.state !== SessionState.new) {
        throw `Cannot establish a session in the '${clientChannel.state}' state.`;
      }

      clientChannel.onSessionNegotiating = (s) => {
        try {
          // Has encryption or compression options? ==> negotiate session with parameter or options
          if (s.encryptionOptions != null || s.compressionOptions != null) {
            clientChannel.negotiateSession(compression || s.compressionOptions[0], encryption || s.encryptionOptions[0]);
          } else {
            // Apply transport options
            if (s.compression !== clientChannel.transport.compression) {
              clientChannel.transport.setCompression(s.compression);
            }
            if (s.encryption !== clientChannel.transport.encryption) {
              clientChannel.transport.setEncryption(s.encryption);
            }
          }
        } catch (e) {
          this.onFailure(clientChannel, listener, e);
        }
      }

      clientChannel.onSessionAuthenticating = (s) => {
        try {
          clientChannel.authenticateSession(identity, authentication, instance);
        } catch (e) {
          this.onFailure(clientChannel, listener, e);
        }
      }

      clientChannel.onSessionEstablished = clientChannel.onSessionFailed = (s) => {
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
