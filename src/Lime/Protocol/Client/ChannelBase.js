"use strict";
var Command_1 = require("../Command");
var Notification_1 = require("../Notification");
var Session_1 = require("../Session");
var ChannelBase = (function () {
    function ChannelBase(transport, autoReplyPings, autoNotifyReceipt) {
        var _this = this;
        this.autoReplyPings = autoReplyPings;
        this.autoNotifyReceipt = autoNotifyReceipt;
        this.transport = transport;
        this.state = Session_1.SessionState.new;
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
                        event: Notification_1.NotificationEvent.received
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
                    command.method === Command_1.CommandMethod.get) {
                    var pingCommandResponse = {
                        id: command.id,
                        to: command.from,
                        method: Command_1.CommandMethod.get,
                        status: Command_1.CommandStatus.success,
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
        if (this.state !== Session_1.SessionState.established) {
            throw new Error("Cannot send in the '" + this.state + "' state");
        }
        this.send(message);
    };
    ChannelBase.prototype.onMessage = function (message) { };
    ChannelBase.prototype.sendCommand = function (command) {
        if (this.state !== Session_1.SessionState.established) {
            throw new Error("Cannot send in the '" + this.state + "' state");
        }
        this.send(command);
    };
    ChannelBase.prototype.onCommand = function (command) { };
    ChannelBase.prototype.sendNotification = function (notification) {
        if (this.state !== Session_1.SessionState.established) {
            throw new Error("Cannot send in the '" + this.state + "' state");
        }
        this.send(notification);
    };
    ChannelBase.prototype.onNotification = function (notification) { };
    ChannelBase.prototype.sendSession = function (session) {
        if (this.state === Session_1.SessionState.finished ||
            this.state === Session_1.SessionState.failed) {
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
exports.ChannelBase = ChannelBase;
