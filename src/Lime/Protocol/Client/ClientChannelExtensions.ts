namespace Lime {

  export class ClientChannelExtensions {

    static establishSession(clientChannel: IClientChannel, compression: string, encryption: string, identity: string, authentication: IAuthentication, instance: string, callback: IEstablishSessionListener): void {
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
        } catch (err) {
          this.removeListeners(clientChannel);
          callback(err, null);
        }
      }

      clientChannel.onSessionAuthenticating = (s) => {
        try {
          clientChannel.authenticateSession(identity, authentication, instance);
        } catch (err) {
          this.removeListeners(clientChannel);
          callback(err, null);
        }
      }

      clientChannel.onSessionEstablished = clientChannel.onSessionFailed = (s) => {
        this.removeListeners(clientChannel);
        callback(null, s);
      };

      try {
        clientChannel.startNewSession();
      } catch (err) {
        this.removeListeners(clientChannel);
        callback(err, null);
      }
    }

    private static removeListeners(clientChannel: IClientChannel): void {
      clientChannel.onSessionNegotiating = null;
      clientChannel.onSessionAuthenticating = null;
      clientChannel.onSessionEstablished = null;
      clientChannel.onSessionFailed = null;
    }
  }
}