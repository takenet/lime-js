"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ChannelBase_1 = require("./ChannelBase");
var Session_1 = require("../Session");
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
            if (s.state === Session_1.SessionState.established) {
                _this.localNode = s.to;
                _this.remoteNode = s.from;
            }
            else if (s.state === Session_1.SessionState.finished || s.state === Session_1.SessionState.failed) {
                try {
                    _this.transport.close();
                }
                catch (e) {
                    console.error(e);
                }
            }
            switch (s.state) {
                case Session_1.SessionState.negotiating:
                    _this.onSessionNegotiating(s);
                    break;
                case Session_1.SessionState.authenticating:
                    _this.onSessionAuthenticating(s);
                    break;
                case Session_1.SessionState.established:
                    _this.onSessionEstablished(s);
                    break;
                case Session_1.SessionState.finished:
                    _this.onSessionFinished(s);
                    break;
                case Session_1.SessionState.failed:
                    _this.onSessionFailed(s);
                default:
            }
        };
    }
    ClientChannel.prototype.startNewSession = function () {
        if (this.state !== Session_1.SessionState.new) {
            throw "Cannot start a session in the '" + this.state + "' state.";
        }
        var session = {
            state: Session_1.SessionState.new
        };
        this.sendSession(session);
    };
    ClientChannel.prototype.negotiateSession = function (sessionCompression, sessionEncryption) {
        if (this.state !== Session_1.SessionState.negotiating) {
            throw "Cannot negotiate a session in the '" + this.state + "' state.";
        }
        var session = {
            id: this.sessionId,
            state: Session_1.SessionState.negotiating,
            compression: sessionCompression,
            encryption: sessionEncryption
        };
        this.sendSession(session);
    };
    ClientChannel.prototype.authenticateSession = function (identity, authentication, instance) {
        if (this.state !== Session_1.SessionState.authenticating) {
            throw "Cannot authenticate a session in the '" + this.state + "' state.";
        }
        var session = {
            id: this.sessionId,
            state: Session_1.SessionState.authenticating,
            from: identity + "/" + instance,
            scheme: authentication.scheme || "unknown",
            authentication: authentication
        };
        this.sendSession(session);
    };
    ClientChannel.prototype.sendFinishingSession = function () {
        if (this.state !== Session_1.SessionState.established) {
            throw "Cannot finish a session in the '" + this.state + "' state.";
        }
        var session = {
            id: this.sessionId,
            state: Session_1.SessionState.finishing
        };
        this.sendSession(session);
    };
    ClientChannel.prototype.onSessionNegotiating = function (session) { };
    ClientChannel.prototype.onSessionAuthenticating = function (session) { };
    ClientChannel.prototype.onSessionEstablished = function (session) { };
    ClientChannel.prototype.onSessionFinished = function (session) { };
    ClientChannel.prototype.onSessionFailed = function (session) { };
    return ClientChannel;
}(ChannelBase_1.ChannelBase));
exports.ClientChannel = ClientChannel;
