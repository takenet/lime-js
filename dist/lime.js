var Lime;
(function (Lime) {
    var CommandMethod = (function () {
        function CommandMethod() {
        }
        CommandMethod.get = "get";
        CommandMethod.set = "set";
        CommandMethod.delete = "delete";
        CommandMethod.observe = "observe";
        CommandMethod.subscribe = "subscribe";
        return CommandMethod;
    })();
    Lime.CommandMethod = CommandMethod;
    var CommandStatus = (function () {
        function CommandStatus() {
        }
        CommandStatus.success = "success";
        CommandStatus.failure = "failure";
        return CommandStatus;
    })();
    Lime.CommandStatus = CommandStatus;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var NotificationEvent = (function () {
        function NotificationEvent() {
        }
        NotificationEvent.accepted = "accepted";
        NotificationEvent.validated = "validated";
        NotificationEvent.authorized = "authorized";
        NotificationEvent.dispatched = "dispatched";
        NotificationEvent.received = "received";
        NotificationEvent.consumed = "consumed";
        return NotificationEvent;
    })();
    Lime.NotificationEvent = NotificationEvent;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var SessionState = (function () {
        function SessionState() {
        }
        SessionState.new = "new";
        SessionState.negotiating = "negotiating";
        SessionState.authenticating = "authenticating";
        SessionState.established = "established";
        SessionState.finishing = "finishing";
        SessionState.finished = "finished";
        SessionState.failed = "failed";
        return SessionState;
    })();
    Lime.SessionState = SessionState;
    var SessionEncryption = (function () {
        function SessionEncryption() {
        }
        SessionEncryption.none = "none";
        SessionEncryption.tls = "tls";
        return SessionEncryption;
    })();
    Lime.SessionEncryption = SessionEncryption;
    var SessionCompression = (function () {
        function SessionCompression() {
        }
        SessionCompression.none = "none";
        SessionCompression.gzip = "gzip";
        return SessionCompression;
    })();
    Lime.SessionCompression = SessionCompression;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var Channel = (function () {
        function Channel(transport, autoReplyPings, autoNotifyReceipt) {
            var _this = this;
            this.autoReplyPings = autoReplyPings;
            this.autoNotifyReceipt = autoNotifyReceipt;
            this.transport = transport;
            this.transport.onEnvelope = function (e) {
                if (e.hasOwnProperty("event")) {
                    _this.onNotification(e);
                }
                else if (e.hasOwnProperty("content")) {
                    var message = e;
                    if (_this.autoNotifyReceipt &&
                        message.id &&
                        message.from) {
                        var notification = {
                            id: message.id,
                            to: message.from,
                            event: Lime.NotificationEvent.received
                        };
                        _this.sendNotification(notification);
                    }
                    _this.onMessage(message);
                }
                else if (e.hasOwnProperty("method")) {
                    var command = e;
                    if (_this.autoReplyPings &&
                        command.id &&
                        command.from &&
                        command.uri === "/ping" &&
                        command.method === Lime.CommandMethod.get) {
                        var pingCommandResponse = {
                            id: command.id,
                            to: command.from,
                            method: Lime.CommandMethod.get,
                            status: Lime.CommandStatus.success,
                            type: "application/vnd.lime.ping+json"
                        };
                        _this.sendCommand(pingCommandResponse);
                    }
                    else {
                        _this.onCommand(command);
                    }
                }
                else if (e.hasOwnProperty("state")) {
                    _this.onSession(e);
                }
            };
            this.state = Lime.SessionState.new;
        }
        Channel.prototype.sendMessage = function (message) {
            if (this.state !== Lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(message);
        };
        Channel.prototype.onMessage = function (message) { };
        Channel.prototype.sendCommand = function (command) {
            if (this.state !== Lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(command);
        };
        Channel.prototype.onCommand = function (command) { };
        Channel.prototype.sendNotification = function (notification) {
            if (this.state !== Lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(notification);
        };
        Channel.prototype.onNotification = function (notification) { };
        Channel.prototype.sendSession = function (session) {
            if (this.state === Lime.SessionState.finished ||
                this.state === Lime.SessionState.failed) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(session);
        };
        Channel.prototype.onSession = function (session) { };
        Channel.prototype.send = function (envelope) {
            this.transport.send(envelope);
        };
        return Channel;
    })();
    Lime.Channel = Channel;
})(Lime || (Lime = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lime;
(function (Lime) {
    var ClientChannel = (function (_super) {
        __extends(ClientChannel, _super);
        function ClientChannel(transport, autoReplyPings, autoNotifyReceipt) {
            var _this = this;
            if (autoReplyPings === void 0) { autoReplyPings = true; }
            if (autoNotifyReceipt === void 0) { autoNotifyReceipt = false; }
            _super.call(this, transport, autoReplyPings, autoNotifyReceipt);
            _super.prototype.onSession = function (s) {
                _this.sessionId = s.id;
                _this.state = s.state;
                if (s.state === Lime.SessionState.established) {
                    _this.localNode = s.to;
                    _this.remoteNode = s.from;
                }
                else if (s.state === Lime.SessionState.finished || s.state === Lime.SessionState.failed) {
                    try {
                        _this.transport.close();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                switch (s.state) {
                    case Lime.SessionState.negotiating:
                        if (_this.onSessionNegotiating != null) {
                            _this.onSessionNegotiating(s);
                        }
                        break;
                    case Lime.SessionState.authenticating:
                        if (_this.onSessionAuthenticating != null) {
                            _this.onSessionAuthenticating(s);
                        }
                        break;
                    case Lime.SessionState.established:
                        if (_this.onSessionEstablished != null) {
                            _this.onSessionEstablished(s);
                        }
                        break;
                    case Lime.SessionState.finished:
                        if (_this.onSessionFinished != null) {
                            _this.onSessionFinished(s);
                        }
                    case Lime.SessionState.failed:
                        if (_this.onSessionFailed != null) {
                            _this.onSessionFailed(s);
                        }
                    default:
                }
            };
        }
        ClientChannel.prototype.startNewSession = function () {
            if (this.state !== Lime.SessionState.new) {
                throw "Cannot start a session in the '" + this.state + "' state.";
            }
            var session = {
                state: Lime.SessionState.new
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.negotiateSession = function (sessionCompression, sessionEncryption) {
            if (this.state !== Lime.SessionState.negotiating) {
                throw "Cannot negotiate a session in the '" + this.state + "' state.";
            }
            var session = {
                id: this.sessionId,
                state: Lime.SessionState.negotiating,
                compression: sessionCompression,
                encryption: sessionEncryption
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.authenticateSession = function (identity, authentication, instance) {
            if (this.state !== Lime.SessionState.authenticating) {
                throw "Cannot authenticate a session in the '" + this.state + "' state.";
            }
            var scheme = authentication.scheme || "unknown";
            var session = {
                id: this.sessionId,
                state: Lime.SessionState.authenticating,
                from: identity + "/" + instance,
                scheme: scheme,
                authentication: authentication
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.sendFinishingSession = function () {
            if (this.state !== Lime.SessionState.established) {
                throw "Cannot finish a session in the '" + this.state + "' state.";
            }
            var session = {
                id: this.sessionId,
                state: Lime.SessionState.finishing
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.onSessionNegotiating = function (session) { };
        ClientChannel.prototype.onSessionAuthenticating = function (session) { };
        ClientChannel.prototype.onSessionEstablished = function (session) { };
        ClientChannel.prototype.onSessionFinished = function (session) { };
        ClientChannel.prototype.onSessionFailed = function (session) { };
        return ClientChannel;
    })(Lime.Channel);
    Lime.ClientChannel = ClientChannel;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var ClientChannelExtensions = (function () {
        function ClientChannelExtensions() {
        }
        ClientChannelExtensions.establishSession = function (clientChannel, compression, encryption, identity, authentication, instance, listener) {
            var _this = this;
            if (clientChannel.state !== Lime.SessionState.new) {
                throw "Cannot establish a session in the '" + clientChannel.state + "' state.";
            }
            clientChannel.onSessionNegotiating = function (s) {
                try {
                    if (s.encryptionOptions != null || s.compressionOptions != null) {
                        var sessionCompression = compression;
                        if (sessionCompression === null) {
                            sessionCompression = s.compressionOptions[0];
                        }
                        var sessionEncryption = encryption;
                        if (sessionEncryption === null) {
                            sessionEncryption = s.encryptionOptions[0];
                        }
                        clientChannel.negotiateSession(sessionCompression, sessionEncryption);
                    }
                    else {
                        if (s.compression !== clientChannel.transport.compression) {
                            clientChannel.transport.setCompression(s.compression);
                        }
                        if (s.encryption !== clientChannel.transport.encryption) {
                            clientChannel.transport.setEncryption(s.encryption);
                        }
                    }
                }
                catch (e1) {
                    _this.onFailure(clientChannel, listener, e1);
                }
            };
            clientChannel.onSessionAuthenticating = function (s) {
                try {
                    clientChannel.authenticateSession(identity, authentication, instance);
                }
                catch (e2) {
                    _this.onFailure(clientChannel, listener, e2);
                }
            };
            clientChannel.onSessionEstablished = function (s) {
                _this.onResult(clientChannel, listener, s);
            };
            clientChannel.onSessionFailed = function (s) {
                _this.onResult(clientChannel, listener, s);
            };
            try {
                clientChannel.startNewSession();
            }
            catch (e) {
                this.onFailure(clientChannel, listener, e);
            }
        };
        ClientChannelExtensions.onResult = function (clientChannel, listener, session) {
            this.removeListeners(clientChannel);
            listener.onResult(session);
        };
        ClientChannelExtensions.onFailure = function (clientChannel, listener, exception) {
            this.removeListeners(clientChannel);
            listener.onFailure(exception);
        };
        ClientChannelExtensions.removeListeners = function (clientChannel) {
            clientChannel.onSessionNegotiating = null;
            clientChannel.onSessionAuthenticating = null;
            clientChannel.onSessionEstablished = null;
            clientChannel.onSessionFailed = null;
        };
        return ClientChannelExtensions;
    })();
    Lime.ClientChannelExtensions = ClientChannelExtensions;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var WebSocketTransport = (function () {
        function WebSocketTransport(traceEnabled) {
            if (traceEnabled === void 0) { traceEnabled = false; }
            this.traceEnabled = traceEnabled;
        }
        WebSocketTransport.prototype.send = function (envelope) {
            this.ensureSocketOpen();
            var envelopeString = JSON.stringify(envelope);
            this.webSocket.send(envelopeString);
            if (this.traceEnabled) {
                console.debug("SEND: " + envelopeString);
            }
        };
        WebSocketTransport.prototype.onEnvelope = function (envelope) { };
        WebSocketTransport.prototype.open = function (uri) {
            var _this = this;
            this.webSocket = new WebSocket(uri, "lime");
            if (uri.indexOf("wss://") > -1) {
                this.encryption = Lime.SessionEncryption.tls;
            }
            else {
                this.encryption = Lime.SessionEncryption.none;
            }
            this.compression = Lime.SessionCompression.none;
            this.webSocket.onmessage = function (e) {
                if (_this.traceEnabled) {
                    console.debug("RECEIVE: " + e.data);
                }
                var object = JSON.parse(e.data);
                var envelope;
                if (object.hasOwnProperty("event")) {
                    envelope = object;
                }
                else if (object.hasOwnProperty("content")) {
                    envelope = object;
                }
                else if (object.hasOwnProperty("method")) {
                    envelope = object;
                }
                else if (object.hasOwnProperty("state")) {
                    envelope = object;
                }
                else {
                    return;
                }
                _this.onEnvelope(envelope);
            };
            this.webSocket.onopen = function (e) {
                if (_this.stateListener != null) {
                    _this.stateListener.onOpen();
                }
            };
            this.webSocket.onclose = function (e) {
                if (_this.stateListener != null) {
                    _this.stateListener.onClosed();
                }
                _this.webSocket = null;
            };
            this.webSocket.onerror = function (e) {
                if (_this.stateListener != null) {
                    _this.stateListener.onError(e.toString());
                }
                _this.webSocket = null;
                console.log(e);
            };
        };
        WebSocketTransport.prototype.close = function () {
            this.ensureSocketOpen();
            this.webSocket.close();
        };
        WebSocketTransport.prototype.ensureSocketOpen = function () {
            if (this.webSocket == null ||
                this.webSocket.readyState !== WebSocket.OPEN) {
                throw "The connection is not open";
            }
        };
        WebSocketTransport.prototype.getSupportedCompression = function () { throw new Error("Encryption change is not supported"); };
        WebSocketTransport.prototype.setCompression = function (compression) { };
        WebSocketTransport.prototype.getSupportedEncryption = function () { throw new Error("Encryption change is not supported"); };
        WebSocketTransport.prototype.setEncryption = function (encryption) { };
        return WebSocketTransport;
    })();
    Lime.WebSocketTransport = WebSocketTransport;
})(Lime || (Lime = {}));
var Lime;
(function (Lime) {
    var AuthenticationScheme = (function () {
        function AuthenticationScheme() {
        }
        AuthenticationScheme.guest = "guest";
        AuthenticationScheme.plain = "plain";
        AuthenticationScheme.transport = "transport";
        AuthenticationScheme.key = "key";
        return AuthenticationScheme;
    })();
    Lime.AuthenticationScheme = AuthenticationScheme;
    var GuestAuthentication = (function () {
        function GuestAuthentication() {
            this.scheme = AuthenticationScheme.guest;
        }
        return GuestAuthentication;
    })();
    Lime.GuestAuthentication = GuestAuthentication;
    var TransportAuthentication = (function () {
        function TransportAuthentication() {
            this.scheme = AuthenticationScheme.transport;
        }
        return TransportAuthentication;
    })();
    Lime.TransportAuthentication = TransportAuthentication;
    var PlainAuthentication = (function () {
        function PlainAuthentication() {
            this.scheme = AuthenticationScheme.plain;
        }
        return PlainAuthentication;
    })();
    Lime.PlainAuthentication = PlainAuthentication;
    var KeyAuthentication = (function () {
        function KeyAuthentication() {
            this.scheme = AuthenticationScheme.key;
        }
        return KeyAuthentication;
    })();
    Lime.KeyAuthentication = KeyAuthentication;
})(Lime || (Lime = {}));
