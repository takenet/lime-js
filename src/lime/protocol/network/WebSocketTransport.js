"use strict";
var Session_1 = require("../Session");
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
            this.encryption = Session_1.SessionEncryption.tls;
        }
        else {
            this.encryption = Session_1.SessionEncryption.none;
        }
        this.compression = Session_1.SessionCompression.none;
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
exports.WebSocketTransport = WebSocketTransport;
