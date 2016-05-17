var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lime;
(function (lime) {
    var ChannelBase = (function () {
        function ChannelBase(transport, autoReplyPings, autoNotifyReceipt) {
            var _this = this;
            this.autoReplyPings = autoReplyPings;
            this.autoNotifyReceipt = autoNotifyReceipt;
            this.transport = transport;
            this.state = lime.SessionState.new;
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
                            event: lime.NotificationEvent.received
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
                        command.method === lime.CommandMethod.get) {
                        var pingCommandResponse = {
                            id: command.id,
                            to: command.from,
                            method: lime.CommandMethod.get,
                            status: lime.CommandStatus.success,
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
        }
        ChannelBase.prototype.sendMessage = function (message) {
            if (this.state !== lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(message);
        };
        ChannelBase.prototype.onMessage = function (message) { };
        ChannelBase.prototype.sendCommand = function (command) {
            if (this.state !== lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(command);
        };
        ChannelBase.prototype.onCommand = function (command) { };
        ChannelBase.prototype.sendNotification = function (notification) {
            if (this.state !== lime.SessionState.established) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(notification);
        };
        ChannelBase.prototype.onNotification = function (notification) { };
        ChannelBase.prototype.sendSession = function (session) {
            if (this.state === lime.SessionState.finished ||
                this.state === lime.SessionState.failed) {
                throw new Error("Cannot send in the '" + this.state + "' state");
            }
            this.send(session);
        };
        ChannelBase.prototype.onSession = function (session) { };
        ChannelBase.prototype.send = function (envelope) {
            this.transport.send(envelope);
        };
        return ChannelBase;
    }());
    lime.ChannelBase = ChannelBase;
})(lime || (lime = {}));
var lime;
(function (lime) {
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
                if (s.state === lime.SessionState.established) {
                    _this.localNode = s.to;
                    _this.remoteNode = s.from;
                }
                else if (s.state === lime.SessionState.finished || s.state === lime.SessionState.failed) {
                    try {
                        _this.transport.close();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                switch (s.state) {
                    case lime.SessionState.negotiating:
                        _this.onSessionNegotiating(s);
                        break;
                    case lime.SessionState.authenticating:
                        _this.onSessionAuthenticating(s);
                        break;
                    case lime.SessionState.established:
                        _this.onSessionEstablished(s);
                        break;
                    case lime.SessionState.finished:
                        _this.onSessionFinished(s);
                        break;
                    case lime.SessionState.failed:
                        _this.onSessionFailed(s);
                    default:
                }
            };
        }
        ClientChannel.prototype.startNewSession = function () {
            if (this.state !== lime.SessionState.new) {
                throw "Cannot start a session in the '" + this.state + "' state.";
            }
            var session = {
                state: lime.SessionState.new
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.negotiateSession = function (sessionCompression, sessionEncryption) {
            if (this.state !== lime.SessionState.negotiating) {
                throw "Cannot negotiate a session in the '" + this.state + "' state.";
            }
            var session = {
                id: this.sessionId,
                state: lime.SessionState.negotiating,
                compression: sessionCompression,
                encryption: sessionEncryption
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.authenticateSession = function (identity, authentication, instance) {
            if (this.state !== lime.SessionState.authenticating) {
                throw "Cannot authenticate a session in the '" + this.state + "' state.";
            }
            var session = {
                id: this.sessionId,
                state: lime.SessionState.authenticating,
                from: identity + "/" + instance,
                scheme: authentication.scheme || "unknown",
                authentication: authentication
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.sendFinishingSession = function () {
            if (this.state !== lime.SessionState.established) {
                throw "Cannot finish a session in the '" + this.state + "' state.";
            }
            var session = {
                id: this.sessionId,
                state: lime.SessionState.finishing
            };
            this.sendSession(session);
        };
        ClientChannel.prototype.onSessionNegotiating = function (session) { };
        ClientChannel.prototype.onSessionAuthenticating = function (session) { };
        ClientChannel.prototype.onSessionEstablished = function (session) { };
        ClientChannel.prototype.onSessionFinished = function (session) { };
        ClientChannel.prototype.onSessionFailed = function (session) { };
        return ClientChannel;
    }(lime.ChannelBase));
    lime.ClientChannel = ClientChannel;
})(lime || (lime = {}));
var lime;
(function (lime) {
    var ClientChannelExtensions = (function () {
        function ClientChannelExtensions() {
        }
        ClientChannelExtensions.establishSession = function (clientChannel, compression, encryption, identity, authentication, instance, callback) {
            var _this = this;
            if (clientChannel.state !== lime.SessionState.new) {
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
                    callback(s, err);
                }
            };
            clientChannel.onSessionAuthenticating = function (s) {
                try {
                    clientChannel.authenticateSession(identity, authentication, instance);
                }
                catch (err) {
                    _this.removeListeners(clientChannel);
                    callback(s, err);
                }
            };
            clientChannel.onSessionEstablished = clientChannel.onSessionFailed = function (s) {
                _this.removeListeners(clientChannel);
                callback(s, null);
            };
            try {
                clientChannel.startNewSession();
            }
            catch (err) {
                this.removeListeners(clientChannel);
                callback(null, err);
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
    lime.ClientChannelExtensions = ClientChannelExtensions;
})(lime || (lime = {}));
var lime;
(function (lime) {
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
                console.debug("WebSocket SEND: " + envelopeString);
            }
        };
        WebSocketTransport.prototype.onEnvelope = function (envelope) { };
        WebSocketTransport.prototype.open = function (uri) {
            var _this = this;
            this.webSocket = new WebSocket(uri, "lime");
            if (uri.indexOf("wss://") > -1) {
                this.encryption = lime.SessionEncryption.tls;
            }
            else {
                this.encryption = lime.SessionEncryption.none;
            }
            this.compression = lime.SessionCompression.none;
            this.webSocket.onmessage = function (e) {
                if (_this.traceEnabled) {
                    console.debug("WebSocket RECEIVE: " + e.data);
                }
                _this.onEnvelope(JSON.parse(e.data));
            };
            this.webSocket.onopen = this.onOpen;
            this.webSocket.onclose = this.onClose;
            this.webSocket.onerror = function (e) {
                _this.onError(new Error(e.toString()));
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
        WebSocketTransport.prototype.getSupportedCompression = function () { throw new Error("Compression change is not supported"); };
        WebSocketTransport.prototype.setCompression = function (compression) { };
        WebSocketTransport.prototype.getSupportedEncryption = function () { throw new Error("Encryption change is not supported"); };
        WebSocketTransport.prototype.setEncryption = function (encryption) { };
        WebSocketTransport.prototype.onOpen = function () { };
        WebSocketTransport.prototype.onClose = function () { };
        WebSocketTransport.prototype.onError = function (error) { };
        WebSocketTransport.prototype.isConnected = function () {
            return this.webSocket.readyState === WebSocket.OPEN;
        };
        return WebSocketTransport;
    }());
    lime.WebSocketTransport = WebSocketTransport;
})(lime || (lime = {}));
var lime;
(function (lime) {
    var Authentication = (function () {
        function Authentication() {
        }
        Authentication.guest = "guest";
        Authentication.plain = "plain";
        Authentication.transport = "transport";
        Authentication.key = "key";
        return Authentication;
    }());
    lime.Authentication = Authentication;
    var GuestAuthentication = (function (_super) {
        __extends(GuestAuthentication, _super);
        function GuestAuthentication() {
            _super.apply(this, arguments);
            this.scheme = Authentication.guest;
        }
        return GuestAuthentication;
    }(Authentication));
    lime.GuestAuthentication = GuestAuthentication;
    var TransportAuthentication = (function (_super) {
        __extends(TransportAuthentication, _super);
        function TransportAuthentication() {
            _super.apply(this, arguments);
            this.scheme = Authentication.transport;
        }
        return TransportAuthentication;
    }(Authentication));
    lime.TransportAuthentication = TransportAuthentication;
    var PlainAuthentication = (function (_super) {
        __extends(PlainAuthentication, _super);
        function PlainAuthentication() {
            _super.apply(this, arguments);
            this.scheme = Authentication.plain;
        }
        return PlainAuthentication;
    }(Authentication));
    lime.PlainAuthentication = PlainAuthentication;
    var KeyAuthentication = (function (_super) {
        __extends(KeyAuthentication, _super);
        function KeyAuthentication() {
            _super.apply(this, arguments);
            this.scheme = Authentication.key;
        }
        return KeyAuthentication;
    }(Authentication));
    lime.KeyAuthentication = KeyAuthentication;
})(lime || (lime = {}));
var lime;
(function (lime) {
    var CommandMethod = (function () {
        function CommandMethod() {
        }
        CommandMethod.get = "get";
        CommandMethod.set = "set";
        CommandMethod.delete = "delete";
        CommandMethod.observe = "observe";
        CommandMethod.subscribe = "subscribe";
        return CommandMethod;
    }());
    lime.CommandMethod = CommandMethod;
    var CommandStatus = (function () {
        function CommandStatus() {
        }
        CommandStatus.success = "success";
        CommandStatus.failure = "failure";
        return CommandStatus;
    }());
    lime.CommandStatus = CommandStatus;
})(lime || (lime = {}));
var lime;
(function (lime) {
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
    }());
    lime.NotificationEvent = NotificationEvent;
})(lime || (lime = {}));
var lime;
(function (lime) {
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
    }());
    lime.SessionState = SessionState;
    var SessionEncryption = (function () {
        function SessionEncryption() {
        }
        SessionEncryption.none = "none";
        SessionEncryption.tls = "tls";
        return SessionEncryption;
    }());
    lime.SessionEncryption = SessionEncryption;
    var SessionCompression = (function () {
        function SessionCompression() {
        }
        SessionCompression.none = "none";
        SessionCompression.gzip = "gzip";
        return SessionCompression;
    }());
    lime.SessionCompression = SessionCompression;
})(lime || (lime = {}));
