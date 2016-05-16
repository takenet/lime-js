"use strict";
var Session_1 = require("../Session");
var ClientChannelExtensions = (function () {
    function ClientChannelExtensions() {
    }
    ClientChannelExtensions.establishSession = function (clientChannel, compression, encryption, identity, authentication, instance, callback) {
        var _this = this;
        if (clientChannel.state !== Session_1.SessionState.new) {
            throw "Cannot establish a session in the '" + clientChannel.state + "' state.";
        }
        clientChannel.onSessionNegotiating = function (s) {
            try {
                // Has encryption or compression options? ==> negotiate session with parameter or options
                if (s.encryptionOptions != null || s.compressionOptions != null) {
                    clientChannel.negotiateSession(compression || s.compressionOptions[0], encryption || s.encryptionOptions[0]);
                }
                else {
                    // Apply transport options
                    if (s.compression !== clientChannel.transport.compression) {
                        clientChannel.transport.setCompression(s.compression);
                    }
                    if (s.encryption !== clientChannel.transport.encryption) {
                        clientChannel.transport.setEncryption(s.encryption);
                    }
                }
            }
            catch (err) {
                _this.removeListeners(clientChannel);
                callback(err, null);
            }
        };
        clientChannel.onSessionAuthenticating = function (s) {
            try {
                clientChannel.authenticateSession(identity, authentication, instance);
            }
            catch (err) {
                _this.removeListeners(clientChannel);
                callback(err, null);
            }
        };
        clientChannel.onSessionEstablished = clientChannel.onSessionFailed = function (s) {
            _this.removeListeners(clientChannel);
            callback(null, s);
        };
        try {
            clientChannel.startNewSession();
        }
        catch (err) {
            this.removeListeners(clientChannel);
            callback(err, null);
        }
    };
    ClientChannelExtensions.removeListeners = function (clientChannel) {
        clientChannel.onSessionNegotiating = null;
        clientChannel.onSessionAuthenticating = null;
        clientChannel.onSessionEstablished = null;
        clientChannel.onSessionFailed = null;
    };
    return ClientChannelExtensions;
}());
exports.ClientChannelExtensions = ClientChannelExtensions;
